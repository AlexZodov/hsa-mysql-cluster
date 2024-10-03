import { User } from '../../domain';

export abstract class UserRepository {
  abstract save(user: User): Promise<User>;
  abstract insertMany(users: User[]): Promise<User[]>;
  abstract findOne(id: string): Promise<User | undefined>;
  abstract getTotalCount(): Promise<number>;
  abstract delete(user: User): Promise<void>;
}
