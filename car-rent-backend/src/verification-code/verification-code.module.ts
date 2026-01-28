import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerificationCode } from './entities/verification-code.entity';
import { VerificationCodeService } from './verification-code.service';
import { VerificationCodeResolver } from './verification-code.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([VerificationCode])],
  providers: [VerificationCodeService, VerificationCodeResolver],
  exports: [VerificationCodeService],
})
export class VerificationCodeModule {}
