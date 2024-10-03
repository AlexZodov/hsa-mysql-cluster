import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure';
import { UserService } from './user.service';

@Module({
  imports: [InfrastructureModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserServicesModule {}
