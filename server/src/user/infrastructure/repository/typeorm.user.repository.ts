import { UserRepository } from '../../services';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../domain';
import { Repository } from 'typeorm';

@Injectable()
export class TypeormUserRepository implements UserRepository {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
  ) {}

  async delete(user: User): Promise<void> {
    await this.repository.remove(user);
  }

  async findOne(id: string): Promise<User | undefined> {
    return await this.repository.findOneBy({ id: id });
  }

  async save(user: User): Promise<User> {
    return await this.repository.save(user);
  }

  async getTotalCount(): Promise<number> {
    return await this.repository.count({});
  }

  async insertMany(users: User[]): Promise<User[]> {
    await this.repository.insert(users);

    return users;
  }
}
