import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../domain';
import { UserRepository } from '../services';
import { TypeormUserRepository } from './repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    {
      provide: UserRepository,
      useClass: TypeormUserRepository,
    },
  ],
  exports: [UserRepository],
})
export class InfrastructureModule {}
