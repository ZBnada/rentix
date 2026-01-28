import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { VerificationCodeType } from '../../entities/verification-code.entity';

registerEnumType(VerificationCodeType, {
  name: 'VerificationCodeType',
  description: 'Type de code de vérification',
});

@ObjectType('VerificationCode')
export class VerificationCodeResource {
  @Field(() => ID)
  id: string;

  @Field()
  code: string;

  @Field(() => VerificationCodeType)
  type: VerificationCodeType;

  @Field()
  email: string;

  @Field()
  expiresAt: Date;

  @Field()
  isUsed: boolean;

  @Field({ nullable: true })
  usedAt?: Date;

  @Field({ nullable: true })
  userId?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
