import { Controller, Post, Body } from '@nestjs/common';
import { UserTrialService } from './user-trial.service';
import { CreateUserTrialDto } from './dto/create-user-trial.dto';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('User Trial')
@Controller('user-trial')
export class UserTrialController {
  constructor(private readonly userTrialService: UserTrialService) {}

  @Post()
  @ApiOperation({ summary: 'Register a new user trial' })
  @ApiBody({ type: CreateUserTrialDto })
  create(@Body() createUserTrialDto: CreateUserTrialDto) {
    return this.userTrialService.create(createUserTrialDto);
  }
}
