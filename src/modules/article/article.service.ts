import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ArticleEntity, UserEntity } from '../../database/entities';
import { CreateArticleDto, UpdateArticleDto } from './dto';

@Injectable()
export class ArticleService {
  constructor(
    @Inject(ArticleEntity.name)
    private readonly articleRepository: typeof ArticleEntity,
  ) {}

  async getById(id: UserEntity['id']): Promise<ArticleEntity> {
    const article = await this.articleRepository.findByPk(id, {
      include: [{ model: UserEntity, attributes: { exclude: ['password'] } }],
    });

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

  async update(id: ArticleEntity['id'], user: UserEntity, dto: UpdateArticleDto) {
    const article = await this.getById(id);

    if (article.authorId !== user.id) {
      throw new ForbiddenException('You are not allowed to update this article');
    }

    await article.update({
      title: dto.title,
      description: dto.description,
    });

    return article;
  }

  async delete(user: UserEntity, id: ArticleEntity['id']) {
    const article = await this.getById(id);

    if (article.authorId !== user.id) {
      throw new ForbiddenException('You are not allowed to delete this article');
    }

    const deleted = await this.articleRepository.destroy({ where: { id } });

    return { deleted: Boolean(deleted) };
  }
}
