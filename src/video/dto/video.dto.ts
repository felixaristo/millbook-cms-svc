import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class CreateVideoDto {
  @ApiProperty({ example: 'My Awesome Video', description: 'Title of the video' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', description: 'URL of the video' })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  url: string;
}

export class UpdateVideoDto {
  @ApiProperty({ example: 'My Updated Video Title', description: 'New title of the video', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: 'https://vimeo.com/123456789', description: 'New URL of the video', required: false })
  @IsOptional()
  @IsString()
  @IsUrl()
  url?: string;
}
