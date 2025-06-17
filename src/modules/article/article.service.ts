import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FindOptions, Includeable, Op } from 'sequelize';
import { ArticleEntity, UserEntity } from '../../database/entities';
import { CreateArticleDto, FindAllArticlesDto, UpdateArticleDto } from './dto';

@Injectable()
export class ArticleService {
  private readonly joinAuthor: Includeable[] = [
    { model: UserEntity, attributes: { exclude: ['password'] } },
  ];

  constructor(
    @Inject(ArticleEntity.name)
    private readonly articleRepository: typeof ArticleEntity,
  ) {}

  async list(query: FindAllArticlesDto) {
    const { limit, offset, sortBy, sortDirection, search, authorId } = query;

    const options: FindOptions<ArticleEntity> = {
      limit,
      offset,
      order: [[sortBy, sortDirection]],
      where: {
        ...(authorId ? { authorId } : {}),
      },
      include: this.joinAuthor,
    };

    if (search) {
      const value = `%${search}%`;
      options.where = {
        ...options.where,
        [Op.or]: [{ title: { [Op.iLike]: value } }, { description: { [Op.iLike]: value } }],
      };
    }

    const { rows: data, count: total } = await this.articleRepository.findAndCountAll(options);

    return { total, limit, offset, data };
  }

  async getById(id: UserEntity['id']): Promise<ArticleEntity> {
    const article = await this.articleRepository.findByPk(id, {
      include: this.joinAuthor,
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
