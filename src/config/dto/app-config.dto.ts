import { plainToInstance, Transform, Type } from 'class-transformer';
import { IsInt, Max, Min, ValidateNested } from 'class-validator';
import { PostgresConfigDto } from './postgres-config.dto';

export class AppConfigDto {
  @IsInt()
  @Min(1024)
  @Max(65535)
  @Type(() => Number)
  readonly port: number;

  @ValidateNested()
  @Transform(({ value }) => plainToInstance(PostgresConfigDto, value))
  readonly postgres: PostgresConfigDto;
}
