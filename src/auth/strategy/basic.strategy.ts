import { BasicStrategy } from 'passport-http';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BasicStrategyProvider extends PassportStrategy(BasicStrategy) {
  constructor(private configService: ConfigService) {
    super();
  }

  public validate(username: string, password: string): boolean {
    const basicUsername = this.configService.get<string>('BASIC_USERNAME');
    const basicPassword = this.configService.get<string>('BASIC_PASSWORD');

    if (username === basicUsername && password === basicPassword) {
      return true;
    }
    throw new UnauthorizedException();
  }
}
