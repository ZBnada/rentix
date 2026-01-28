import { InputType, Field, Float, Int } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsUUID,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EnergieType } from '../enums/energie.enum';
import { ClasseVehicule } from '../enums/classe-vehicule.enum';

/**
 * Input pour la création d'un véhicule
 */
@InputType()
export class CreateVehiculeInput {
  @Field(() => String)
  @IsNotEmpty({ message: 'Le matricule est obligatoire' })
  @IsString()
  matricule: string;

  @Field(() => String)
  @IsNotEmpty({ message: 'La marque est obligatoire' })
  @IsUUID('4', { message: "L'ID de la marque doit être un UUID valide" })
  marqueId: string;

  @Field(() => String)
  @IsNotEmpty({ message: 'Le type est obligatoire' })
  @IsString()
  type: string;

  @Field(() => Date)
  @IsNotEmpty({
    message: 'La date de première mise en circulation est obligatoire',
  })
  @Type(() => Date)
  @IsDate()
  datePremiereMiseEnCirculation: Date;

  @Field(() => Int, { defaultValue: 0 })
  @IsNumber()
  puissance: number;

  @Field(() => EnergieType, { defaultValue: EnergieType.ESSENCE })
  @IsEnum(EnergieType, { message: "Type d'énergie invalide" })
  energie: EnergieType;

  @Field(() => Int, { defaultValue: 0 })
  @IsNumber()
  compteur: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  couleur?: string;

  @Field(() => Float, { defaultValue: 0 })
  @IsNumber()
  prixAchat: number;

  @Field(() => ClasseVehicule, { defaultValue: ClasseVehicule.TOURISTIQUE })
  @IsEnum(ClasseVehicule, { message: 'Classe de véhicule invalide' })
  classeVehicule: ClasseVehicule;

  @Field(() => Float, { defaultValue: 0 })
  @IsNumber()
  prixLocationJournee: number;

  @Field(() => Float, { defaultValue: 0 })
  @IsNumber()
  prixHeureRetard: number;

  @Field(() => Boolean, { defaultValue: false })
  @IsBoolean()
  roueSecours: boolean;

  @Field(() => Boolean, { defaultValue: false })
  @IsBoolean()
  cricManivelle: boolean;

  @Field(() => Boolean, { defaultValue: false })
  @IsBoolean()
  jeuHousse: boolean;

  @Field(() => Boolean, { defaultValue: false })
  @IsBoolean()
  siegeBebe: boolean;

  @Field(() => Boolean, { defaultValue: false })
  @IsBoolean()
  jeuTapis: boolean;

  @Field(() => Boolean, { defaultValue: false })
  @IsBoolean()
  posteRadio: boolean;

  @Field(() => Boolean, { defaultValue: false })
  @IsBoolean()
  jeuEnjoliveurs: boolean;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  observations?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  saisiPar?: string;
}
