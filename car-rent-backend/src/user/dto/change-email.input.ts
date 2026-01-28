import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';

@InputType()
export class ChangeEmailInput {
  @Field()
  @IsEmail({}, { message: 'Email invalide' })
  @IsNotEmpty({ message: 'Le nouvel email est obligatoire' })
  newEmail: string;

  @Field()
  @IsNotEmpty({ message: 'Le mot de passe est obligatoire' })
  password: string;
}
