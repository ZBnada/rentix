import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';

@InputType()
export class ResetPasswordInput {
  @Field()
  @IsEmail({}, { message: 'Email invalide' })
  @IsNotEmpty({ message: "L'email est obligatoire" })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'Le code de réinitialisation est obligatoire' })
  @Matches(/^\d{6}$/, {
    message: 'Le code doit contenir exactement 6 chiffres',
  })
  code: string;

  @Field()
  @IsNotEmpty({ message: 'Le nouveau mot de passe est obligatoire' })
  @MinLength(8, {
    message: 'Le mot de passe doit contenir au moins 8 caractères',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Le mot de passe doit contenir une majuscule, une minuscule, un chiffre et un caractère spécial',
  })
  newPassword: string;
}
