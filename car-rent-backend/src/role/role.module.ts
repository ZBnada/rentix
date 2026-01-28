import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { RoleService } from './role.service';
import { RoleResolver } from './role.resolver';
import { RoleMapper } from './mappers/role.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  providers: [RoleService, RoleResolver, RoleMapper],
  exports: [RoleService, RoleMapper],
})
export class RoleModule {}
