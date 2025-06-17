import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UserEntity } from '../../database/entities';
import { User } from '../../decorators';
import { AuthGuard } from '../../guards';
import { IdNumberDto } from '../../shared';
import { ArticleService } from './article.service';
import { CreateArticleDto, UpdateArticleDto } from './dto';

@Controller('article')
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Создать новую статью' })
  @Post()
  async create(@User() user: UserEntity, @Body() body: CreateArticleDto) {
    return this.articleService.create(user, body);
  }

  @ApiOperation({ summary: 'Получить список статей' })
  @Get('/')
  async list() {}

  @ApiOperation({ summary: 'Получить статью по id' })
  @Get('/:id')
  async index(@Param() { id }: IdNumberDto) {
    return this.articleService.getById(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Обновить статью' })
  @Put('/:id')
  async update(
    @Param() { id }: IdNumberDto,
    @User() user: UserEntity,
    @Body() body: UpdateArticleDto,
  ) {
    return this.articleService.update(id, user, body);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Удалить статью' })
  @Delete('/:id')
  async delete(@User() user: UserEntity, @Param() { id }: IdNumberDto) {
    return this.articleService.delete(user, id);
  }
}
