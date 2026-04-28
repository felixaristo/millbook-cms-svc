import { Controller, Request, Post, Body, UnauthorizedException, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiBody, ApiBasicAuth, ApiBearerAuth } from '@nestjs/swagger';
import { AuthLoginDto } from './dto/auth-login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBasicAuth()
  @UseGuards(AuthGuard('basic'))
  @Post('login')
  @ApiOperation({ summary: 'User login with Basic Auth' })
  @ApiBody({ type: AuthLoginDto })
  async login(@Body() loginDto: AuthLoginDto) {
    const user = await this.authService.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  @ApiOperation({ summary: 'Get user profile with JWT' })
  getProfile(@Request() req) {
    return req.user;
  }
}
