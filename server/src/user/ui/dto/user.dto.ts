import { User } from '../../domain';

export class UserDto {
  id: string;
  name: string;
  someValue: string;
  created_at: number;
  updated_at: number;

  static fromEntity(entity: User): UserDto {
    return {
      id: entity.id,
      name: entity.name,
      someValue: entity.someValue,
      created_at: entity.createdAt.getTime(),
      updated_at: entity.updatedAt.getTime(),
    };
  }
}
