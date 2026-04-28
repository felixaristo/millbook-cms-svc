import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(User)
    private memberRepository: Repository<User>,
  ) {}

  async findAll(page: number = 1, limit: number = 10) {
    const [data, total] = await this.memberRepository.findAndCount({
      where: { role: 2 },
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
    const member = await this.memberRepository.findOne({ where: { id, role: 2 } });
    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }
    return member;
  }

  async create(data: Partial<User>) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    const newMember = this.memberRepository.create({ ...data, role: 2 });
    return this.memberRepository.save(newMember);
  }

  async update(id: number, data: Partial<User>) {
    const member = await this.findOne(id);
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    Object.assign(member, data);
    return this.memberRepository.save(member);
  }

  async remove(id: number) {
    const member = await this.findOne(id);
    return this.memberRepository.softRemove(member);
  }
}
