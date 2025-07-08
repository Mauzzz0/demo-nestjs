/* eslint-disable camelcase,@typescript-eslint/no-explicit-any */
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class UserService {
  private readonly logger = new Logger();

  private readonly mdeAiGroupName = 'mde-ai-users';

  /**
   * Активация пользователя - установить enabled: true и добавить группу mde-ai-users
   * Activating user in Keycloak - set "enabled: true" and add to group "mde-ai-users"
   */
  async activate(userId: string) {
    // 1. Входим в кейклоак под админом. Дальше все запросы в кейклоак будут идти с этим токеном, то есть из-под администратора
    // Authenticate in keycloak as Admin
    const adminAccessToken = await this.getKeycloakAdminAccessToken();
    if (!adminAccessToken) {
      throw new InternalServerErrorException('Could not authenticate with Keycloak');
    }

    // 2. Ищем профиль того пользователя, которого хотим включить (по userId из пути запроса, который @Params)
    // Get user profile from keycloak
    const keycloakUser = await this.getKeycloakUser(userId, adminAccessToken);
    if (!keycloakUser) {
      throw new NotFoundException('User not found');
    }

    // 3. Получаем список текущих групп, в которых состоит пользователь
    // Get user groups
    const userGroups = await this.getUserGroups(userId, adminAccessToken);

    // 4. Определяем находится ли пользователь уже в группе mde-ai-users
    // Is this user already in mde-ai-users?
    const inMdeGroup = userGroups.find((gr) => gr.name === this.mdeAiGroupName);

    // 5. Если пользователь уже включён и уже состоит в группе, то никаких действий не требуется
    // If user already enabled and have mde-ai-users -> no action required, it is already ok
    if (keycloakUser.enabled && inMdeGroup) {
      return {
        userId,
        message: 'User is already active',
        status: 'active',
      };
    }

    // 6. Идёт дальше, включаем пользователя и добавляем его в группу

    // 7. Включаем пользователя, выставляем ему enabled: true
    // Set "enabled: true" in Keycloak for this user
    const updatedSuccessfully = await this.activateUserInKeycloak(userId, adminAccessToken);
    if (!updatedSuccessfully) {
      throw new InternalServerErrorException('Failed to update user');
    }

    // 8. Если пользователь не группе "mde-ai-users", то нужно добавить его в эту группу
    // If this user is not in "mde-ai-users" => add user to group "mde-ai-users"
    if (!inMdeGroup) {
      // 9. Запрашиваем все группы, которые есть в кейклоак, чтобы найти нужную
      // Get all available groups from Keycloak
      const allGroups = await this.getAllKeycloakGroups(adminAccessToken);

      // 10. Ищем группу, по её имени находим её id
      // Find "mde-ai-users" group to obtain it's id
      const mdeGroup = allGroups.find((gr) => gr.name === this.mdeAiGroupName);

      // 11. Если группа найдена, добавляем пользователя в неё
      if (mdeGroup) {
        // 12. Добавляем пользователя userId в нужную группу groupId
        // Add user to "mde-ai-users" group by userId and groupId
        await this.addGroupToUser(userId, mdeGroup.id, adminAccessToken);
      }
    }

    // 12. Логируем действие
    // Log action
    this.logger.log(`USER_MANAGEMENT: User Activated | User: ${userId} | Admin: admin_user`);

    // 13. Отдаём ответ
    // Return response
    return {
      userId,
      message: 'User successfully activate',
      status: 'active',
    };
  }

  /**
   * Добавить пользователя в группу, по userId и groupId
   * Add user to group by userId and groupId. Requires admin token.
   */
  private async addGroupToUser(
    userId: string,
    groupId: string,
    token: string,
  ): Promise<boolean | null> {
    try {
      // Add Group (by groupId) to User (by userId)
      const { status } = await axios.put(
        `${process.env.KEYCLOAK_SERVER_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users/${userId}/groups/${groupId}`,
        undefined, // <-- Вот тут я не уверен будет ли работать, нужно отправить put запрос без тела
        { headers: { Authorization: `Bearer ${token}` } },
      );

      return status === 204;
    } catch (error) {
      return null;
    }
  }

  /**
   * Установить "enabled: true" пользователю в кейклоак
   * Add "enabled: true" to user in keycloak. Requires admin token.
   */
  private async activateUserInKeycloak(userId: string, token: string): Promise<boolean | null> {
    try {
      // Updating exists user in keycloak
      const { status } = await axios.put(
        `${process.env.KEYCLOAK_SERVER_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users/${userId}`,
        { enabled: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            ContentType: 'application/json',
          },
        },
      );

      return status === 204;
    } catch (error) {
      return null;
    }
  }

  /**
   * Получить список всех групп в кейлоак (не по пользователю, а вообще всех)
   * Get all exists groups in keycloak. Requires admin token.
   */
  private async getAllKeycloakGroups(token: string): Promise<Record<string, any>[]> {
    // Get all exists groups in keycloak
    const { data } = await axios.get(
      `${process.env.KEYCLOAK_SERVER_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/groups`,
      { headers: { Authorization: `Bearer ${token}` } },
    );

    return data;
  }

  /**
   * Получить список групп, в которых состоит пользователь по userId
   * Get user groups. Requires admin token.
   */
  private async getUserGroups(userId: string, token: string): Promise<Record<string, any>[]> {
    // Get user groups by userId
    const { data } = await axios.get(
      `${process.env.KEYCLOAK_SERVER_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users/${userId}/groups`,
      { headers: { Authorization: `Bearer ${token}` } },
    );

    return data;
  }

  /**
   * Получить токен админа кейклоак, для входа используется статичный пароль и логин, которые указаны в переменных окружения.
   * Get Keycloak Admin User access token by static password and username from config (env). Requires admin token.
   */
  private async getKeycloakAdminAccessToken(): Promise<string | null> {
    try {
      // Authenticate in Keycloak as Administrator (admin-cli) and get Admin access token
      const { data } = await axios.post<{ access_token: string }>(
        `${process.env.KEYCLOAK_SERVER_URL}/realms/master/protocol/openid-connect/token`,
        {
          client_id: 'admin-cli',
          username: process.env.KEYCLOAK_ADMIN_USER,
          password: process.env.KEYCLOAK_ADMIN_PASSWORD,
          grant_type: 'password',
        },
      );

      return data.access_token;
    } catch (error) {
      return null;
    }
  }

  /**
   * Найти пользователя кейклоак по его userId.
   * Get Keycloak User by userId. Requires admin token.
   */
  private async getKeycloakUser(
    userId: string,
    token: string,
  ): Promise<Record<string, any> | null> {
    try {
      // Find user by his userId
      const { data } = await axios.get(
        `${process.env.KEYCLOAK_SERVER_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      return data;
    } catch (error) {
      return null;
    }
  }
}
