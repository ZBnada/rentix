import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

interface GoogleUserRequest extends Request {
  user?: {
    email: string;
    firstName: string;
    lastName: string;
    googleId: string;
    accessToken: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Route pour démarrer l'authentification Google
   * URL: http://localhost:3000/auth/google
   */
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(): Promise<void> {
    // La redirection vers Google est gérée automatiquement par le Guard
  }

  /**
   * Callback après authentification Google
   * URL: http://localhost:3000/auth/google/callback
   */
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(
    @Req() req: GoogleUserRequest,
    @Res() res: Response,
  ): Promise<void> {
    if (!req.user) {
      const frontendUrl =
        this.configService.get<string>('FRONTEND_URL') ||
        'http://localhost:4200';
      res.redirect(`${frontendUrl}/auth/error?message=Authentication failed`);
      return;
    }

    const googleUser = req.user;

    try {
      // Créer ou connecter l'utilisateur
      const result = await this.authService.googleLogin({
        email: googleUser.email,
        firstName: googleUser.firstName,
        lastName: googleUser.lastName,
        googleId: googleUser.googleId,
      });

      // Rediriger vers le frontend avec les tokens
      const frontendUrl =
        this.configService.get<string>('FRONTEND_URL') ||
        'http://localhost:4200';
      const redirectUrl = `${frontendUrl}/auth/callback?accessToken=${result.accessToken}&refreshToken=${result.refreshToken}`;

      res.redirect(redirectUrl);
    } catch {
      const frontendUrl =
        this.configService.get<string>('FRONTEND_URL') ||
        'http://localhost:4200';
      res.redirect(`${frontendUrl}/auth/error?message=Login failed`);
    }
  }
}
