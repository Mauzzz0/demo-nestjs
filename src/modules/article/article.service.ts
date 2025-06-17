import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ArticleEntity, UserEntity } from '../../database/entities';
import { CreateArticleDto } from './dto';

@Injectable()
export class ArticleService {
  constructor(
    @Inject(ArticleEntity.name)
    private readonly articleRepository: typeof ArticleEntity,
  ) {}

  async getById(id: UserEntity['id']): Promise<ArticleEntity> {
    const article = await this.articleRepository.findByPk(id);

    if (!article) {
      throw new NotFoundException('Article does not exist');
    }

    return article;
  }

  async create(user: UserEntity, dto: CreateArticleDto) {
    return this.articleRepository.create({
      title: dto.title,
      description: dto.description,
      authorId: user.id,
    });
  }

  async delete(user: UserEntity, id: ArticleEntity['id']) {
    const article = await this.getById(id);

    if (article.authorId !== user.id) {
      throw new ForbiddenException('You are not allowed to delete this article');
    }

    const deleted = await this.articleRepository.destroy({ where: { id } });

    return { success: Boolean(deleted) };
  }
}
