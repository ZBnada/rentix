import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';
import { VerificationCodeModule } from '../verification-code/verification-code.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret:
          configService.get('JWT_SECRET') || 'default-jwt-secret-change-this',
        signOptions: {
          expiresIn: '1d',
        },
      }),
    }),
    UserModule,
    RoleModule,
    VerificationCodeModule,
    EmailModule,
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthResolver, JwtStrategy, GoogleStrategy],
  exports: [AuthService],
})
export class AuthModule {}
