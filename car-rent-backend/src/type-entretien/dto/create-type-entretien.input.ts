import { InputType, Field, Float, Int } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsInt,
  IsBoolean,
  Min,
  MaxLength,
} from 'class-validator';

/**
 * Input GraphQL pour créer un type d'entretien
 */
@InputType('CreateTypeEntretienInput')
export class CreateTypeEntretienInput {
  @Field(() => String, {
    description: "Code du type d'entretien (E01, E02...)",
  })
  @IsNotEmpty({ message: 'Le code est requis' })
  @IsString()
  @MaxLength(50)
  codeEntretien: string;

  @Field(() => String, { description: "Désignation du type d'entretien" })
  @IsNotEmpty({ message: 'La désignation est requise' })
  @IsString()
  @MaxLength(255)
  designation: string;

  @Field(() => String, { description: 'Description détaillée', nullable: true })
  @IsOptional()
  @IsString()
  description?: string | null;

  @Field(() => Int, {
    description: 'Fréquence recommandée en jours',
    nullable: true,
  })
  @IsOptional()
  @IsInt({ message: 'La fréquence doit être un nombre entier' })
  @Min(1)
  frequenceJoursRecommandee?: number | null;

  @Field(() => Int, {
    description: 'Fréquence recommandée en kilomètres',
    nullable: true,
  })
  @IsOptional()
  @IsInt({ message: 'La fréquence doit être un nombre entier' })
  @Min(1)
  frequenceKmRecommandee?: number | null;

  @Field(() => Float, {
    description: 'Coût moyen estimé',
    defaultValue: 0,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Le coût doit être un nombre' })
  @Min(0)
  coutMoyenEstime?: number;

  @Field(() => Boolean, {
    description: "Indique si l'entretien est obligatoire",
    defaultValue: false,
  })
  @IsOptional()
  @IsBoolean()
  estObligatoire?: boolean;
}
