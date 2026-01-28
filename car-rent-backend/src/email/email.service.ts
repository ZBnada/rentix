import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASSWORD'),
      },
    });
  }

  /**
   * Envoie un code de vérification par email
   */
  async sendVerificationCode(
    email: string,
    code: string,
    firstName: string,
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>('MAIL_FROM'),
        to: email,
        subject: 'Code de vérification - Location Voiture',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Bonjour ${firstName},</h2>
            <p>Merci de vous être inscrit sur notre plateforme de location de voiture.</p>
            <p>Voici votre code de vérification :</p>
            <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
              ${code}
            </div>
            <p>Ce code expire dans 15 minutes.</p>
            <p>Si vous n'avez pas demandé ce code, veuillez ignorer cet email.</p>
            <hr style="border: 1px solid #eee; margin: 30px 0;">
            <p style="color: #999; font-size: 12px;">Location Voiture - Tunis, Tunisie</p>
          </div>
        `,
      });
      this.logger.log(`Code de vérification envoyé à ${email}`);
    } catch (error) {
      this.logger.error(`Erreur lors de l'envoi du code à ${email}:`, error);
      throw new Error("Erreur lors de l'envoi de l'email");
    }
  }

  /**
   * Envoie un code de réinitialisation de mot de passe
   */
  async sendPasswordResetCode(
    email: string,
    code: string,
    firstName: string,
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>('MAIL_FROM'),
        to: email,
        subject: 'Réinitialisation de mot de passe - Location Voiture',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Bonjour ${firstName},</h2>
            <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
            <p>Voici votre code de réinitialisation :</p>
            <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
              ${code}
            </div>
            <p>Ce code expire dans 15 minutes.</p>
            <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email et votre mot de passe restera inchangé.</p>
            <hr style="border: 1px solid #eee; margin: 30px 0;">
            <p style="color: #999; font-size: 12px;">Location Voiture - Tunis, Tunisie</p>
          </div>
        `,
      });
      this.logger.log(`Code de réinitialisation envoyé à ${email}`);
    } catch (error) {
      this.logger.error(`Erreur lors de l'envoi du code à ${email}:`, error);
      throw new Error("Erreur lors de l'envoi de l'email");
    }
  }

  /**
   * Envoie un email de bienvenue après vérification
   */
  async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>('MAIL_FROM'),
        to: email,
        subject: 'Bienvenue sur Location Voiture !',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Bienvenue ${firstName} ! 🎉</h2>
            <p>Votre compte a été vérifié avec succès.</p>
            <p>Vous pouvez maintenant profiter de tous nos services de location de voiture.</p>
            <a href="${this.configService.get<string>('FRONTEND_URL')}/login" 
               style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
              Se connecter
            </a>
            <p>À bientôt sur notre plateforme !</p>
            <hr style="border: 1px solid #eee; margin: 30px 0;">
            <p style="color: #999; font-size: 12px;">Location Voiture - Tunis, Tunisie</p>
          </div>
        `,
      });
      this.logger.log(`Email de bienvenue envoyé à ${email}`);
    } catch (error) {
      this.logger.error(
        `Erreur lors de l'envoi de l'email de bienvenue à ${email}:`,
        error,
      );
    }
  }
}
