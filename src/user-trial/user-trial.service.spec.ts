import { Test, TestingModule } from '@nestjs/testing';
import { UserTrialService } from './user-trial.service';

describe('UserTrialService', () => {
  let service: UserTrialService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserTrialService],
    }).compile();

    service = module.get<UserTrialService>(UserTrialService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
