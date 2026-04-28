import { Test, TestingModule } from '@nestjs/testing';
import { UserTrialController } from './user-trial.controller';

describe('UserTrialController', () => {
  let controller: UserTrialController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserTrialController],
    }).compile();

    controller = module.get<UserTrialController>(UserTrialController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
