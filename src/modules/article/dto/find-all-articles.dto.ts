import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { SortDirection } from '../../../shared';

export enum ArticlesSortByEnum {
  id = 'id',
  title = 'title',
  description = 'description',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
}

export class FindAllArticlesDto {
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @ApiPropertyOptional({ example: 1 })
  authorId?: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'корг' })
  search?: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @ApiPropertyOptional({ example: 10 })
  limit: number = 10;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @ApiPropertyOptional({ example: 0 })
  offset: number = 0;

  @IsEnum(ArticlesSortByEnum)
  @IsOptional()
  @ApiPropertyOptional({ enum: ArticlesSortByEnum, example: ArticlesSortByEnum.createdAt })
  sortBy: ArticlesSortByEnum = ArticlesSortByEnum.createdAt;

  @IsEnum(SortDirection)
  @IsOptional()
  @ApiPropertyOptional({ enum: SortDirection, example: SortDirection.desc })
  sortDirection: SortDirection = SortDirection.desc;
}
