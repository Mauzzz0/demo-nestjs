import { ApiProperty } from '@nestjs/swagger';
import { UserProfileDto } from '../../user/dto';

export class ArticleResponseDto {
  @ApiProperty({ example: 8 })
  id: number;

  @ApiProperty({ example: 'Собаки породы Корги стали жить, в среднем, 75 лет.' })
  title: string;

  @ApiProperty({ example: 'Это необъяснимо, но факт! 😱' })
  description: string;

  @ApiProperty({ example: 1 })
  authorId: number;

  @ApiProperty({ example: '2025-06-17T13:07:37.788Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-06-17T14:25:46.443Z' })
  updatedAt: string;

  @ApiProperty({ type: UserProfileDto })
  author: UserProfileDto;
}
