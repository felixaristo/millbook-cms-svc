import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video } from './video.entity';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video)
    private videoRepository: Repository<Video>,
  ) {}

  async findAll(page: number = 1, limit: number = 10) {
    const [data, total] = await this.videoRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        last_page: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const video = await this.videoRepository.findOne({ where: { id } });
    if (!video) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }
    return video;
  }

  async create(data: Partial<Video>) {
    const video = this.videoRepository.create(data);
    return this.videoRepository.save(video);
  }

  async update(id: number, data: Partial<Video>) {
    const video = await this.findOne(id);
    Object.assign(video, data);
    return this.videoRepository.save(video);
  }

  async remove(id: number) {
    const video = await this.findOne(id);
    return this.videoRepository.softRemove(video);
  }
}
