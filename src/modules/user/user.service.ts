import { Inject, Injectable } from '@nestjs/common';
import { UserEntity } from '../../database/entities';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserEntity.name)
    private readonly userRepository: typeof UserEntity,
  ) {}

  async getUserByEmail(email: UserEntity['email']): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { email } });
  }
}
