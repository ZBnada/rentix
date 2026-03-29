import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { StatutVignette } from '../enums/statut-vignette.enum';

/**
 * Input de filtrage pour la liste des vignettes
 */
@InputType()
export class FilterVignetteInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  matriculeVehicule?: string;

  @Field(() => StatutVignette, { nullable: true })
  @IsOptional()
  @IsEnum(StatutVignette)
  statut?: StatutVignette;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsDateString()
  dateOperationDebut?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsDateString()
  dateOperationFin?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  saisiPar?: string;
}
