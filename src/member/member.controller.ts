import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { MemberService } from './member.service';
import { User } from '../users/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiQuery, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CreateMemberDto, UpdateMemberDto } from './dto/member.dto';

@ApiTags('Members')
@ApiBearerAuth()
@Controller('members')
@UseGuards(AuthGuard('jwt'))
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get()
  @ApiOperation({ summary: 'Get all members with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.memberService.findAll(+page, +limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a member by ID' })
  findOne(@Param('id') id: string) {
    return this.memberService.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new member' })
  @ApiBody({ type: CreateMemberDto })
  create(@Body() data: CreateMemberDto) {
    return this.memberService.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing member' })
  @ApiBody({ type: UpdateMemberDto })
  update(@Param('id') id: string, @Body() data: UpdateMemberDto) {
    return this.memberService.update(+id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a member by ID' })
  remove(@Param('id') id: string) {
    return this.memberService.remove(+id);
  }
}
