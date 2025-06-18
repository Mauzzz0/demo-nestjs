import { ApiProperty } from '@nestjs/swagger';

export class TokensDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzUwMjMxOTEyLCJleHAiOjE3NTAyMzU1MTJ9.pvKqX9MH9gndlim5mTdjvyIRlJa8y4maHAdCiAf0R6Y',
  })
  accessToken: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzUwMjMxOTEyLCJleHAiOjE3NTA4MzY3MTJ9.IXdIZBIioO0IhzjTrh-3fdaqUs86tQozHCzs-DgdkK8',
  })
  refreshToken: string;
}
