import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTrialService } from './user-trial.service';
import { UserTrialController } from './user-trial.controller';
import { UserTrial } from './user-trial.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserTrial])],
  providers: [UserTrialService],
  controllers: [UserTrialController],
})
export class UserTrialModule {}
