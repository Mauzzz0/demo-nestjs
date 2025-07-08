import { Controller, Param, Put } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { randomUUID } from 'node:crypto';
import { UserService } from './user.service';

export class UserIdDto {
  @IsUUID()
  @ApiProperty({ example: randomUUID() })
  id: string;
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put('/:id/active')
  async activate(@Param() { id }: UserIdDto) {
    return this.userService.activate(id);
  }
}
