import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserTrial } from './user-trial.entity';
import { CreateUserTrialDto } from './dto/create-user-trial.dto';

@Injectable()
export class UserTrialService {
  constructor(
    @InjectRepository(UserTrial)
    private userTrialRepository: Repository<UserTrial>,
  ) {}

  async create(createUserTrialDto: CreateUserTrialDto): Promise<UserTrial> {
    const userTrial = this.userTrialRepository.create(createUserTrialDto);
    return this.userTrialRepository.save(userTrial);
  }
}
