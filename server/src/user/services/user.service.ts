import { Injectable, OnModuleInit } from '@nestjs/common';
import { User, UserNotFoundError } from '../domain';
import { UserRepository } from './interfaces';
import * as uuid from 'uuid';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

type CreateUserOptions = {
  id: string;
  name: string;
  birthDate: Date;
  someValue: string;
};

@Injectable()
export class UserService implements OnModuleInit {
  constructor(private readonly repository: UserRepository) {}

  async create(options: CreateUserOptions): Promise<User> {
    const user = new User();

    user.id = options.id;
    user.name = options.name;
    user.birthDate = options.birthDate;

    return this.repository.save(user);
  }

  async createModel(options: CreateUserOptions): Promise<User> {
    const user = new User();

    user.id = options.id;
    user.name = options.name;
    user.birthDate = options.birthDate;
    user.someValue = options.someValue;
    user.createdAt = new Date();
    user.updatedAt = new Date();

    return user;
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.repository.findOne(id);

    if (!user) {
      throw new UserNotFoundError(id);
    }

    return user;
  }

  async getUserByIdOrNull(id: string): Promise<User | undefined> {
    return await this.repository.findOne(id);
  }

  async deleteUnitById(id: string): Promise<void> {
    const unit = await this.getUserById(id);

    await this.repository.delete(unit);
  }

  async onModuleInit(): Promise<any> {
    let count = 0;
    while (count < 40000000) {
      let batch = <User[]>Array.from({ length: 5000 });
      batch = await Promise.all(
        batch.map(
          async () =>
            await this.createModel({
              id: uuid.v4(),
              name: randomStringGenerator(),
              someValue: randomStringGenerator(),
              birthDate: this.generateRandomDate(
                new Date(1970, 1, 1),
                new Date(2020, 31, 31),
              ),
            }),
        ),
      );

      await this.repository.insertMany(batch);

      count = await this.repository.getTotalCount();
      console.log('Created 5K users...', count);
    }
    console.log('Created 40M users');
  }

  private generateRandomDate(from: Date, to: Date): Date {
    return new Date(
      from.getTime() + Math.random() * (to.getTime() - from.getTime()),
    );
  }
}
