import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { RoleService } from '../role/role.service';
import { VerificationCodeService } from '../verification-code/verification-code.service';
import { EmailService } from '../email/email.service';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { VerifyEmailInput } from './dto/verify-email.input';
import { ForgotPasswordInput } from './dto/forgot-password.input';
import { ResetPasswordInput } from './dto/reset-password.input';
import { User, UserType } from '../user/entities/user.entity';
import { VerificationCodeType } from '../verification-code/entities/verification-code.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly verificationCodeService: VerificationCodeService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * REGISTER - Inscription d'un nouvel utilisateur
   */
  async register(
    input: RegisterInput,
  ): Promise<{ message: string; email: string }> {
    const existingUser = await this.userService.findByEmail(input.email);
    if (existingUser) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    if (input.userType === UserType.COMPANY) {
      if (
        !input.legalCompanyName ||
        !input.countryOfRegistration ||
        !input.streetAddress ||
        !input.zipCode ||
        !input.city
      ) {
        throw new BadRequestException(
          "Les informations de l'entreprise sont obligatoires pour un compte entreprise",
        );
      }
    }

    const clientRole = await this.roleService.findByName('CLIENT');
    if (!clientRole) {
      throw new NotFoundException(
        "Le rôle CLIENT n'existe pas. Veuillez contacter l'administrateur.",
      );
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    // ✅ Utiliser roleName au lieu de roleId
    const user = await this.userService.create({
      ...input,
      password: hashedPassword,
      roleName: 'CLIENT', // ✅ Changé de roleId à roleName
      isEmailVerified: false,
      isActive: true,
    });

    const verificationCode = await this.verificationCodeService.createCode(
      user.email,
      VerificationCodeType.EMAIL_VERIFICATION,
      user.id,
    );

    await this.emailService.sendVerificationCode(
      user.email,
      verificationCode.code,
      user.firstName,
    );

    return {
      message:
        'Inscription réussie. Un code de vérification a été envoyé à votre email.',
      email: user.email,
    };
  }

  /**
   * VERIFY EMAIL - Vérifier l'email avec le code reçu
   */
  async verifyEmail(input: VerifyEmailInput): Promise<{ message: string }> {
    const verificationCode = await this.verificationCodeService.verifyCode(
      input.email,
      input.code,
      VerificationCodeType.EMAIL_VERIFICATION,
    );

    const user = await this.userService.findByEmail(input.email);
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    await this.userService.verifyEmail(user.id);
    await this.verificationCodeService.markAsUsed(verificationCode.id);
    await this.emailService.sendWelcomeEmail(user.email, user.firstName);

    return {
      message:
        'Email vérifié avec succès ! Vous pouvez maintenant vous connecter.',
    };
  }

  /**
   * RESEND VERIFICATION CODE - Renvoyer le code de vérification
   */
  async resendVerificationCode(
    email: string,
  ): Promise<{ message: string; expiresAt: Date }> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Cet email est déjà vérifié');
    }

    const verificationCode = await this.verificationCodeService.createCode(
      email,
      VerificationCodeType.EMAIL_VERIFICATION,
      user.id,
    );

    await this.emailService.sendVerificationCode(
      email,
      verificationCode.code,
      user.firstName,
    );

    return {
      message: 'Un nouveau code de vérification a été envoyé à votre email',
      expiresAt: verificationCode.expiresAt,
    };
  }

  /**
   * LOGIN - Connexion avec email et mot de passe
   */
  async login(
    input: LoginInput,
  ): Promise<{ accessToken: string; refreshToken: string; user: User }> {
    const user = await this.userService.findByEmail(input.email);

    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        "Votre compte a été désactivé. Contactez l'administrateur.",
      );
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedException(
        'Veuillez vérifier votre email avant de vous connecter',
      );
    }

    if (!user.password) {
      throw new UnauthorizedException(
        'Ce compte utilise Google OAuth. Veuillez vous connecter avec Google.',
      );
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    await this.userService.updateLastLogin(user.id);
    const tokens = this.generateTokens(user);

    return {
      ...tokens,
      user,
    };
  }

  /**
   * FORGOT PASSWORD - Demander la réinitialisation du mot de passe
   */
  async forgotPassword(
    input: ForgotPasswordInput,
  ): Promise<{ message: string }> {
    const user = await this.userService.findByEmail(input.email);

    if (!user) {
      return {
        message:
          'Si cet email existe, vous recevrez un code de réinitialisation',
      };
    }

    const resetCode = await this.verificationCodeService.createCode(
      user.email,
      VerificationCodeType.PASSWORD_RESET,
      user.id,
    );

    await this.emailService.sendPasswordResetCode(
      user.email,
      resetCode.code,
      user.firstName,
    );

    return {
      message: 'Si cet email existe, vous recevrez un code de réinitialisation',
    };
  }

  /**
   * RESET PASSWORD - Réinitialiser le mot de passe avec le code
   */
  async resetPassword(input: ResetPasswordInput): Promise<{ message: string }> {
    const resetCode = await this.verificationCodeService.verifyCode(
      input.email,
      input.code,
      VerificationCodeType.PASSWORD_RESET,
    );

    const user = await this.userService.findByEmail(input.email);
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const hashedPassword = await bcrypt.hash(input.newPassword, 10);

    await this.userService.update(user.id, {
      id: user.id,
      password: hashedPassword,
    });

    await this.verificationCodeService.markAsUsed(resetCode.id);

    return {
      message:
        'Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.',
    };
  }

  /**
   * GOOGLE LOGIN - Connexion/Inscription via Google OAuth
   */
  async googleLogin(googleUser: {
    email: string;
    firstName: string;
    lastName: string;
    googleId: string;
  }): Promise<{ accessToken: string; refreshToken: string; user: User }> {
    let user = await this.userService.findByGoogleId(googleUser.googleId);

    if (!user) {
      user = await this.userService.findByEmail(googleUser.email);

      if (user) {
        await this.userService.update(user.id, {
          id: user.id,
          googleId: googleUser.googleId,
        });
      } else {
        const clientRole = await this.roleService.findByName('CLIENT');
        if (!clientRole) {
          throw new NotFoundException("Le rôle CLIENT n'existe pas");
        }

        // ✅ Utiliser roleName au lieu de roleId
        user = await this.userService.create({
          firstName: googleUser.firstName,
          lastName: googleUser.lastName,
          email: googleUser.email,
          googleId: googleUser.googleId,
          phoneNumber: '00000000',
          countryCodePhone: '+216',
          userType: UserType.INDIVIDUAL,
          roleName: 'CLIENT', // ✅ Changé de roleId à roleName
          isEmailVerified: true,
          isActive: true,
        });
      }
    }

    await this.userService.updateLastLogin(user.id);
    const tokens = this.generateTokens(user);

    return {
      ...tokens,
      user,
    };
  }

  /**
   * VALIDATE USER - Valider un utilisateur par ID (pour JWT Strategy)
   */
  async validateUser(userId: string): Promise<User> {
    const user = await this.userService.findOne(userId);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Utilisateur introuvable ou inactif');
    }

    return user;
  }

  /**
   * GENERATE TOKENS - Générer les tokens JWT (access + refresh)
   */
  private generateTokens(user: User): {
    accessToken: string;
    refreshToken: string;
  } {
    const payload = {
      sub: user.id,
      email: user.email,
      roleId: user.roleId,
    };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, {
      secret:
        this.configService.get('JWT_REFRESH_SECRET') ||
        'default-refresh-secret',
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * REFRESH TOKEN - Renouveler le token d'accès
   */
  async refreshToken(refreshTokenValue: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    try {
      interface JwtPayload {
        sub: string;
        email: string;
        roleId: string;
      }

      const payload = this.jwtService.verify(refreshTokenValue, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      }) as JwtPayload;

      const user = await this.validateUser(payload.sub);
      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Token de rafraîchissement invalide');
    }
  }
}
