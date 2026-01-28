import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import {
  VerificationCode,
  VerificationCodeType,
} from './entities/verification-code.entity';

@Injectable()
export class VerificationCodeService {
  private readonly logger = new Logger(VerificationCodeService.name);

  constructor(
    @InjectRepository(VerificationCode)
    private readonly verificationCodeRepository: Repository<VerificationCode>,
  ) {}

  /**
   * Génère un code à 6 chiffres aléatoire
   */
  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Crée un nouveau code de vérification
   * @param email - Email de l'utilisateur
   * @param type - Type de code (EMAIL_VERIFICATION ou PASSWORD_RESET)
   * @param userId - ID de l'utilisateur (optionnel)
   * @param ipAddress - Adresse IP (optionnel)
   * @param userAgent - User agent (optionnel)
   * @returns Le code créé
   */
  async createCode(
    email: string,
    type: VerificationCodeType,
    userId?: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<VerificationCode> {
    // Invalider les anciens codes non utilisés du même type pour cet email
    await this.verificationCodeRepository.update(
      {
        email,
        type,
        isUsed: false,
      },
      {
        isUsed: true,
        usedAt: new Date(),
      },
    );

    // Créer un nouveau code qui expire dans 15 minutes
    const code = this.generateCode();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    const verificationCode = this.verificationCodeRepository.create({
      code,
      email,
      type,
      userId,
      expiresAt,
      ipAddress,
      userAgent,
    });

    const savedCode =
      await this.verificationCodeRepository.save(verificationCode);

    this.logger.log(
      `Code de vérification ${type} créé pour ${email} (expire à ${expiresAt.toLocaleString()})`,
    );

    return savedCode;
  }

  /**
   * Vérifie si un code est valide
   * @param email - Email de l'utilisateur
   * @param code - Code à vérifier
   * @param type - Type de code
   * @returns Le code de vérification si valide
   * @throws BadRequestException si le code est invalide ou expiré
   */
  async verifyCode(
    email: string,
    code: string,
    type: VerificationCodeType,
  ): Promise<VerificationCode> {
    const verificationCode = await this.verificationCodeRepository.findOne({
      where: {
        email,
        code,
        type,
        isUsed: false,
      },
    });

    if (!verificationCode) {
      this.logger.warn(`Code invalide ou déjà utilisé pour ${email}`);
      throw new BadRequestException('Code invalide ou déjà utilisé');
    }

    if (new Date() > verificationCode.expiresAt) {
      this.logger.warn(`Code expiré pour ${email}`);
      throw new BadRequestException(
        'Code expiré. Veuillez demander un nouveau code',
      );
    }

    this.logger.log(`Code vérifié avec succès pour ${email}`);
    return verificationCode;
  }

  /**
   * Marque un code comme utilisé
   * @param codeId - ID du code
   */
  async markAsUsed(codeId: string): Promise<void> {
    await this.verificationCodeRepository.update(codeId, {
      isUsed: true,
      usedAt: new Date(),
    });

    this.logger.log(`Code ${codeId} marqué comme utilisé`);
  }

  /**
   * Vérifie combien de codes ont été créés récemment pour un email
   * Permet de limiter les abus (rate limiting)
   * @param email - Email à vérifier
   * @param type - Type de code
   * @param minutes - Période à vérifier (défaut: 60 minutes)
   * @returns Nombre de codes créés
   */
  async countRecentCodes(
    email: string,
    type: VerificationCodeType,
    minutes = 60,
  ): Promise<number> {
    const since = new Date();
    since.setMinutes(since.getMinutes() - minutes);

    return this.verificationCodeRepository.count({
      where: {
        email,
        type,
        createdAt: LessThan(since),
      },
    });
  }

  /**
   * Vérifie si un utilisateur peut recevoir un nouveau code
   * @param email - Email à vérifier
   * @param type - Type de code
   * @returns true si l'utilisateur peut recevoir un nouveau code
   */
  async canRequestNewCode(
    email: string,
    type: VerificationCodeType,
  ): Promise<boolean> {
    const recentCodesCount = await this.countRecentCodes(email, type, 60);

    // Limite : 5 codes par heure
    if (recentCodesCount >= 5) {
      this.logger.warn(
        `Trop de tentatives pour ${email} (${recentCodesCount} codes en 1h)`,
      );
      return false;
    }

    // Vérifier si un code a été créé il y a moins de 2 minutes
    const veryRecentCode = await this.verificationCodeRepository.findOne({
      where: {
        email,
        type,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    if (veryRecentCode) {
      const twoMinutesAgo = new Date();
      twoMinutesAgo.setMinutes(twoMinutesAgo.getMinutes() - 2);

      if (veryRecentCode.createdAt > twoMinutesAgo) {
        this.logger.warn(
          `Code demandé trop rapidement pour ${email} (attendre 2 minutes)`,
        );
        return false;
      }
    }

    return true;
  }

  /**
   * Récupère le dernier code créé pour un email
   * @param email - Email
   * @param type - Type de code
   * @returns Le dernier code ou null
   */
  async getLatestCode(
    email: string,
    type: VerificationCodeType,
  ): Promise<VerificationCode | null> {
    return this.verificationCodeRepository.findOne({
      where: {
        email,
        type,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  /**
   * Supprime les codes expirés (tâche de nettoyage)
   * À exécuter périodiquement (cron job)
   */
  async cleanupExpiredCodes(): Promise<number> {
    const result = await this.verificationCodeRepository.delete({
      expiresAt: LessThan(new Date()),
      isUsed: true,
    });

    const deletedCount = result.affected || 0;
    this.logger.log(`${deletedCount} code(s) expiré(s) supprimé(s)`);

    return deletedCount;
  }

  /**
   * Supprime tous les codes d'un utilisateur
   * @param userId - ID de l'utilisateur
   */
  async deleteUserCodes(userId: string): Promise<void> {
    await this.verificationCodeRepository.delete({ userId });
    this.logger.log(`Tous les codes de l'utilisateur ${userId} supprimés`);
  }
}
