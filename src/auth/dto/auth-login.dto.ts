import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginDto {
  @ApiProperty({ example: 'admin', description: 'Username for login' })
  username: string;

  @ApiProperty({ example: 'Admin123!', description: 'Password for login' })
  password: string;
}
