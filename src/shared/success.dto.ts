import { ApiProperty } from '@nestjs/swagger';

export class SuccessDto {
  @ApiProperty({ example: true })
  success: boolean;
}
