import { Module } from '@nestjs/common';
import { UserServicesModule } from './services';
import { CreateUserHandler } from './operation';
import { UserController } from './ui';

const handlers = [CreateUserHandler];
@Module({
  imports: [UserServicesModule],
  controllers: [UserController],
  providers: [...handlers],
})
export class UserModule {}
