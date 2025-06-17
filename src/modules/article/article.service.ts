import { Inject, Injectable } from '@nestjs/common';
import { ArticleEntity, UserEntity } from '../../database/entities';
import { CreateArticleDto, UpdateArticleDto } from './dto';

@Injectable()
export class ArticleService {
  constructor(
    @Inject(ArticleEntity.name)
    private readonly articleRepository: typeof ArticleEntity,
  ) {}

  async create(user: UserEntity, dto: CreateArticleDto) {
    return this.articleRepository.create({
      title: dto.title,
      description: dto.description,
      authorId: user.id,
    });
  }

  async update(user: UserEntity, dto: UpdateArticleDto) {
    // return this.articleService.update(user, body);
  }
}
