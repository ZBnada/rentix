import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { UserType } from '../../user/entities/user.entity';

// Enregistrer l'enum pour GraphQL
registerEnumType(UserType, {
  name: 'UserType',
  description: "Type d'utilisateur : individuel ou entreprise",
});

@InputType()
export class RegisterInput {
  @Field()
  @IsNotEmpty({ message: 'Le prénom est obligatoire' })
  @IsString()
  firstName: string;

  @Field()
  @IsNotEmpty({ message: 'Le nom est obligatoire' })
  @IsString()
  lastName: string;

  @Field()
  @IsEmail({}, { message: 'Email invalide' })
  @IsNotEmpty({ message: "L'email est obligatoire" })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'Le mot de passe est obligatoire' })
  @MinLength(8, {
    message: 'Le mot de passe doit contenir au moins 8 caractères',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Le mot de passe doit contenir une majuscule, une minuscule, un chiffre et un caractère spécial',
  })
  password: string;

  @Field({ defaultValue: '+216' })
  @IsString()
  countryCodePhone: string;

  @Field()
  @IsNotEmpty({ message: 'Le numéro de téléphone est obligatoire' })
  @Matches(/^\d{8,15}$/, {
    message: 'Le numéro de téléphone doit contenir entre 8 et 15 chiffres',
  })
  phoneNumber: string;

  @Field(() => UserType, { defaultValue: UserType.INDIVIDUAL })
  @IsEnum(UserType, { message: 'Type utilisateur invalide' })
  userType: UserType;

  // Champs optionnels pour les entreprises
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  legalCompanyName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  countryOfRegistration?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  streetAddress?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  houseNumber?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  city?: string;
}
