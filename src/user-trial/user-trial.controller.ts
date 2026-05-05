import { Controller, Post, Body, Get, Query, UseGuards, Res } from '@nestjs/common';
import { UserTrialService } from './user-trial.service';
import { CreateUserTrialDto } from './dto/create-user-trial.dto';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';

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

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get all user trials with pagination' })
  @ApiQuery({ name: 'paging', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  findAll(
    @Query('paging') paging: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.userTrialService.findAll(+paging, +limit);
  }

  @Get('export-excel')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Export user trials to Excel' })
  exportExcel(@Res() res: Response) {
    return this.userTrialService.exportExcel(res);
  }
}
