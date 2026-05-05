import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { VideoService } from './video.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiQuery, ApiBody, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { CreateVideoDto, UpdateVideoDto } from './dto/video.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('Videos')
@ApiBearerAuth()
@Controller('videos')
@UseGuards(AuthGuard('jwt'))
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get()
  @ApiOperation({ summary: 'Get all videos with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.videoService.findAll(+page, +limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a video by ID' })
  findOne(@Param('id') id: string) {
    return this.videoService.findOne(+id);
  }

  @Get(':id/watch')
  @ApiOperation({ summary: 'Get video details and recommendations for watching' })
  watch(@Param('id') id: string) {
    return this.videoService.watch(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new video' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateVideoDto })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'video', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads',
          filename: (_req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
          },
        }),
      },
    ),
  )
  create(
    @Body() data: CreateVideoDto,
    @UploadedFiles() files: { video?: Express.Multer.File[]; thumbnail?: Express.Multer.File[] },
  ) {
    const videoFile = files.video?.[0];
    const thumbnailFile = files.thumbnail?.[0];
    return this.videoService.create(data, videoFile!, thumbnailFile!);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing video' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateVideoDto })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'video', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads',
          filename: (_req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
          },
        }),
      },
    ),
  )
  update(
    @Param('id') id: string,
    @Body() data: UpdateVideoDto,
    @UploadedFiles() files: { video?: Express.Multer.File[]; thumbnail?: Express.Multer.File[] },
  ) {
    const videoFile = files.video?.[0];
    const thumbnailFile = files.thumbnail?.[0];
    return this.videoService.update(+id, data, videoFile, thumbnailFile);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a video by ID' })
  remove(@Param('id') id: string) {
    return this.videoService.remove(+id);
  }
}
