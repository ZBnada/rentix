import { Resolver, Query, Args } from '@nestjs/graphql';
import { VerificationCodeService } from './verification-code.service';
import { VerificationCodeResource } from '../verification-code/dto/resources/verification-code.resource';
import { VerificationCodeType } from './entities/verification-code.entity';

@Resolver(() => VerificationCodeResource)
export class VerificationCodeResolver {
  constructor(
    private readonly verificationCodeService: VerificationCodeService,
  ) {}

  /**
   * QUERY - Vérifier si un utilisateur peut demander un nouveau code
   * (Pour éviter le spam)
   */
  @Query(() => Boolean, {
    name: 'canRequestVerificationCode',
    description: 'Vérifier si un email peut recevoir un nouveau code',
  })
  async canRequestCode(
    @Args('email') email: string,
    @Args('type', { type: () => VerificationCodeType })
    type: VerificationCodeType,
  ): Promise<boolean> {
    return this.verificationCodeService.canRequestNewCode(email, type);
  }

  /**
   * QUERY - Récupérer le dernier code créé (utile pour debugging en dev)
   * ⚠️ À SUPPRIMER EN PRODUCTION pour des raisons de sécurité
   */
  @Query(() => VerificationCodeResource, {
    name: 'latestVerificationCode',
    description: 'Récupérer le dernier code créé (DEV ONLY)',
    nullable: true,
  })
  async getLatestCode(
    @Args('email') email: string,
    @Args('type', { type: () => VerificationCodeType })
    type: VerificationCodeType,
  ): Promise<VerificationCodeResource | null> {
    const code = await this.verificationCodeService.getLatestCode(email, type);

    if (!code) {
      return null;
    }

    return {
      id: code.id,
      code: code.code,
      type: code.type,
      email: code.email,
      expiresAt: code.expiresAt,
      isUsed: code.isUsed,
      usedAt: code.usedAt,
      userId: code.userId,
      createdAt: code.createdAt,
      updatedAt: code.updatedAt,
    };
  }
}
