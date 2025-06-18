import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { UserEntity } from '../../database/entities';
import { User } from '../../decorators';
import { AuthGuard } from '../../guards';
import { IdNumberDto, SuccessDto } from '../../shared';
import { ApiPaginatedResponse } from '../../swagger';
import { ArticleService } from './article.service';
import { CreateArticleDto, FindAllArticlesDto, UpdateArticleDto } from './dto';
import { ArticleResponseDto } from './dto/article-response.dto';

@Controller('article')
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({ type: ArticleResponseDto })
  @ApiOperation({ summary: 'Создать новую статью' })
  @Post()
  async create(@User() user: UserEntity, @Body() body: CreateArticleDto) {
    return this.articleService.create(user, body);
  }

  @ApiPaginatedResponse(ArticleResponseDto)
  @ApiOperation({ summary: 'Получить список статей' })
  @Get('/')
  async list(@Query() query: FindAllArticlesDto) {
    return this.articleService.list(query);
  }

  @ApiOkResponse({ type: ArticleResponseDto })
  @ApiOperation({ summary: 'Получить статью по id' })
  @Get('/:id')
  async index(@Param() { id }: IdNumberDto) {
    return this.articleService.getById(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOkResponse({ type: ArticleResponseDto })
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
  @ApiOkResponse({ type: SuccessDto })
  @ApiOperation({ summary: 'Удалить статью' })
  @Delete('/:id')
  async delete(@User() user: UserEntity, @Param() { id }: IdNumberDto) {
    return this.articleService.delete(user, id);
  }
}
