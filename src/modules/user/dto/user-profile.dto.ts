import { ApiProperty } from '@nestjs/swagger';

export class UserProfileDto {
  @ApiProperty({ example: 8 })
  id: number;

  @ApiProperty({ example: 'Alexander Xander' })
  name: string;

  @ApiProperty({ example: 'alex@domain.com' })
  email: string;

  @ApiProperty({ example: '2077-03-22T07:28:01.717Z' })
  updatedAt: string;

  @ApiProperty({ example: '2077-03-22T07:28:01.717Z' })
  createdAt: string;
}
