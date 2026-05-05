import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class CreateVideoDto {
  @ApiProperty({ example: 'My Awesome Video', description: 'Title of the video' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: 'string', format: 'binary', description: 'Video file' })
  video: any;

  @ApiProperty({ type: 'string', format: 'binary', description: 'Thumbnail file', required: false })
  @IsOptional()
  thumbnail: any;
}

export class UpdateVideoDto {
  @ApiProperty({ example: 'My Updated Video Title', description: 'New title of the video', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ type: 'string', format: 'binary', description: 'Video file', required: false })
  @IsOptional()
  video?: any;

  @ApiProperty({ type: 'string', format: 'binary', description: 'Thumbnail file', required: false })
  @IsOptional()
  thumbnail?: any;
}
