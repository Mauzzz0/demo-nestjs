import { Controller, Delete, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../../guards';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('article')
export class ArticleController {
  @ApiOperation({ summary: 'Создать новую статью' })
  @Post()
  async create() {}

  @ApiOperation({ summary: 'Получить список статей' })
  @Get('/')
  async list() {}

  @ApiOperation({ summary: 'Получить статью по id' })
  @Get('/:id')
  async index() {}

  @ApiOperation({ summary: 'Обновить статью' })
  @Put('/:id')
  async update() {}

  @ApiOperation({ summary: 'Удалить статью' })
  @Delete('/:id')
  async delete() {}
}
