import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Video } from './video.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video)
    private videoRepository: Repository<Video>,
  ) {
    // Ensure uploads directory exists
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
  }

  async findAll(page: number = 1, limit: number = 10) {
    const [items, total] = await this.videoRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return {
      items,
      total,
      page,
      limit,
    };
  }

  async findOne(id: number) {
    const video = await this.videoRepository.findOne({ where: { id } });
    if (!video) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }
    return video;
  }

  async watch(id: number) {
    const currentVideo = await this.findOne(id);
    
    // Simple recommendation: other videos excluding current one
    const recommendations = await this.videoRepository.find({
      where: { id: Not(id) },
      take: 10,
      order: { created_at: 'DESC' },
    });

    return {
      currentVideo,
      recommendations,
    };
  }

  async create(data: Partial<Video>, videoFile: Express.Multer.File, thumbnailFile?: Express.Multer.File) {
    const video = this.videoRepository.create({
      ...data,
      url: `/uploads/${videoFile.filename}`,
      thumbnail: thumbnailFile ? `/uploads/${thumbnailFile.filename}` : undefined,
    });
    return this.videoRepository.save(video);
  }

  async update(id: number, data: Partial<Video>, videoFile?: Express.Multer.File, thumbnailFile?: Express.Multer.File) {
    const video = await this.findOne(id);
    
    if (videoFile) {
      // Delete old video file if exists
      if (video.url) {
        const oldFilePath = path.join(process.cwd(), video.url);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      video.url = `/uploads/${videoFile.filename}`;
    }

    if (thumbnailFile) {
      // Delete old thumbnail file if exists
      if (video.thumbnail) {
        const oldThumbPath = path.join(process.cwd(), video.thumbnail);
        if (fs.existsSync(oldThumbPath)) {
          fs.unlinkSync(oldThumbPath);
        }
      }
      video.thumbnail = `/uploads/${thumbnailFile.filename}`;
    }

    Object.assign(video, data);
    return this.videoRepository.save(video);
  }

  async remove(id: number) {
    const video = await this.findOne(id);
    
    // Delete video file if exists
    if (video.url) {
      const filePath = path.join(process.cwd(), video.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Delete thumbnail file if exists
    if (video.thumbnail) {
      const thumbPath = path.join(process.cwd(), video.thumbnail);
      if (fs.existsSync(thumbPath)) {
        fs.unlinkSync(thumbPath);
      }
    }

    return this.videoRepository.softRemove(video);
  }
}
