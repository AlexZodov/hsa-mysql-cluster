import { Body, Controller, Post } from '@nestjs/common';
import { UserDto } from '../dto';
import { CreateUserHandler } from '../../operation';
import * as uuid from 'uuid';

@Controller('/user')
export class UserController {
  constructor(private readonly createUserHandler: CreateUserHandler) {}

  @Post('/random')
  async createRandomUnit1(
    @Body() dto: { name?: string; someValue?: string },
  ): Promise<UserDto> {
    const unit1 = await this.createUserHandler.handle({
      unitId: uuid.v4(),
      name: dto?.name ?? 'test',
      someValue: dto?.someValue ?? 'test',
    });

    return UserDto.fromEntity(unit1);
  }
}
