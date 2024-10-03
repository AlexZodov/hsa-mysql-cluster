import { Injectable } from '@nestjs/common';
import { UserService } from '../../services';
import { CreateUserRequest } from '../request';
import { User } from '../../domain';

@Injectable()
export class CreateUserHandler {
  constructor(private readonly service: UserService) {}

  async handle(request: CreateUserRequest): Promise<User> {
    return this.service.create({
      id: request.unitId,
      name: request.name,
      someValue: request.name,
      birthDate: new Date(),
    });
  }
}
