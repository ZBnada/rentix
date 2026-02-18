import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';

@ObjectType('CarnetEntretien')
export class CarnetEntretienResource {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  vehiculeId: string;

  @Field(() => String)
  vehiculeMatricule: string;

  @Field(() => ID)
  typeEntretienId: string;

  @Field(() => String)
  codeEntretien: string;

  @Field(() => String)
  designation: string;

  @Field(() => Date)
  dateDebut: Date;

  @Field(() => Date, { nullable: true })
  dateFin: Date | null;

  @Field(() => Int)
  kilometrageDebut: number;

  @Field(() => Int, { nullable: true })
  kilometrageFin: number | null;

  @Field(() => Float)
  coutEstime: number;

  @Field(() => Float, { nullable: true })
  coutReel: number | null;

  @Field(() => String, { nullable: true })
  notes: string | null;

  @Field(() => String)
  statut: string;

  @Field(() => String, { nullable: true })
  saisiPar: string | null;

  @Field(() => String, { nullable: true })
  modifiePar: string | null;

  @Field(() => Date)
  saisiLe: Date;

  @Field(() => Date)
  modifieLe: Date;
}
