import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  unit1_id: string;

  @IsString()
  type: string;
}
