import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType()
export class ChangeRoleInput {
  @Field(() => ID)
  @IsNotEmpty({ message: "L'ID de l'utilisateur est obligatoire" })
  @IsUUID()
  userId: string;

  @Field(() => ID)
  @IsNotEmpty({ message: "L'ID du rôle est obligatoire" })
  @IsUUID()
  roleId: string;
}
