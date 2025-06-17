import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateArticleDto {
  @ApiPropertyOptional({ example: 'Собаки породы Корги стали жить, в среднем, 75 лет.' })
  @MinLength(1)
  @IsString()
  @IsOptional()
  public title?: string;

  @ApiPropertyOptional({ example: 'Это необъяснимо, но факт! 😱' })
  @MinLength(1)
  @IsString()
  @IsOptional()
  public description?: string;
}
