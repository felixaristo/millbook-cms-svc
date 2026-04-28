import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateMemberDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the member' })
  @IsString()
  @IsNotEmpty()
  fullname: string;

  @ApiProperty({ example: 'john.doe', description: 'Unique username for the member' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'password123', description: 'Password for the member' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UpdateMemberDto {
  @ApiProperty({ example: 'John Doe Updated', description: 'Full name of the member', required: false })
  @IsOptional()
  @IsString()
  fullname?: string;

  @ApiProperty({ example: 'john.doe.updated', description: 'Unique username for the member', required: false })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ example: 'newpassword123', description: 'New password for the member', required: false })
  @IsOptional()
  @IsString()
  password?: string;
}
