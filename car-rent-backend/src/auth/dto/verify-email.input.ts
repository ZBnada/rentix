import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

@InputType()
export class VerifyEmailInput {
  @Field()
  @IsEmail({}, { message: 'Email invalide' })
  @IsNotEmpty({ message: "L'email est obligatoire" })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'Le code de vérification est obligatoire' })
  @Matches(/^\d{6}$/, {
    message: 'Le code doit contenir exactement 6 chiffres',
  })
  code: string;
}
