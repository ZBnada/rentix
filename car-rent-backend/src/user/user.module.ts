import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { UserMapper } from './mappers/user.mapper';
import { RoleModule } from '../role/role.module';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RoleModule, UploadModule],
  controllers: [UserController],
  providers: [UserResolver, UserService, UserMapper],
  exports: [UserService, UserMapper],
})
export class UserModule {}
