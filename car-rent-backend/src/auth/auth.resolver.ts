import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { VerifyEmailInput } from './dto/verify-email.input';
import { ForgotPasswordInput } from './dto/forgot-password.input';
import { ResetPasswordInput } from './dto/reset-password.input';
import {
  AuthResponse,
  MessageResponse,
  ResendCodeResponse,
} from './dto/auth-response';
import { UserMapper } from '../user/mappers/user.mapper';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userMapper: UserMapper,
  ) {}

  /**
   * MUTATION - Inscription d'un nouvel utilisateur
   * Exemple de requête :
   * mutation {
   *   register(registerInput: {
   *     firstName: "Ahmed"
   *     lastName: "Ben Ali"
   *     email: "ahmed@example.com"
   *     password: "Password123!"
   *     phoneNumber: "20123456"
   *     userType: INDIVIDUAL
   *   }) {
   *     message
   *     email
   *   }
   * }
   */
  @Mutation(() => MessageResponse, {
    description:
      "Inscription d'un nouvel utilisateur avec envoi du code de vérification",
  })
  async register(
    @Args('registerInput') input: RegisterInput,
  ): Promise<MessageResponse> {
    const result = await this.authService.register(input);
    return {
      success: true,
      message: result.message,
    };
  }

  /**
   * MUTATION - Vérifier l'email avec le code reçu
   * Exemple de requête :
   * mutation {
   *   verifyEmail(verifyEmailInput: {
   *     email: "ahmed@example.com"
   *     code: "123456"
   *   }) {
   *     success
   *     message
   *   }
   * }
   */
  @Mutation(() => MessageResponse, {
    description: "Vérifier l'email avec le code à 6 chiffres",
  })
  async verifyEmail(
    @Args('verifyEmailInput') input: VerifyEmailInput,
  ): Promise<MessageResponse> {
    const result = await this.authService.verifyEmail(input);
    return {
      success: true,
      message: result.message,
    };
  }

  /**
   * MUTATION - Renvoyer un code de vérification
   * Exemple de requête :
   * mutation {
   *   resendVerificationCode(email: "ahmed@example.com") {
   *     success
   *     message
   *     expiresAt
   *   }
   * }
   */
  @Mutation(() => ResendCodeResponse, {
    description: 'Renvoyer un nouveau code de vérification par email',
  })
  async resendVerificationCode(
    @Args('email') email: string,
  ): Promise<ResendCodeResponse> {
    const result = await this.authService.resendVerificationCode(email);
    return {
      success: true,
      message: result.message,
      expiresAt: result.expiresAt,
    };
  }

  /**
   * MUTATION - Connexion avec email et mot de passe
   * Exemple de requête :
   * mutation {
   *   login(loginInput: {
   *     email: "ahmed@example.com"
   *     password: "Password123!"
   *   }) {
   *     accessToken
   *     refreshToken
   *     user {
   *       id
   *       firstName
   *       lastName
   *       email
   *       role {
   *         name
   *         weight
   *       }
   *     }
   *   }
   * }
   */
  @Mutation(() => AuthResponse, {
    description: 'Connexion avec email et mot de passe',
  })
  async login(@Args('loginInput') input: LoginInput): Promise<AuthResponse> {
    const result = await this.authService.login(input);
    const userResource = this.userMapper.toResource(result.user);

    if (!userResource) {
      throw new Error("Erreur lors de la conversion de l'utilisateur");
    }

    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: userResource,
    };
  }

  /**
   * MUTATION - Demander un code de réinitialisation de mot de passe
   * Exemple de requête :
   * mutation {
   *   forgotPassword(forgotPasswordInput: {
   *     email: "ahmed@example.com"
   *   }) {
   *     success
   *     message
   *   }
   * }
   */
  @Mutation(() => MessageResponse, {
    description: 'Demander un code de réinitialisation de mot de passe',
  })
  async forgotPassword(
    @Args('forgotPasswordInput') input: ForgotPasswordInput,
  ): Promise<MessageResponse> {
    const result = await this.authService.forgotPassword(input);
    return {
      success: true,
      message: result.message,
    };
  }

  /**
   * MUTATION - Réinitialiser le mot de passe avec le code
   * Exemple de requête :
   * mutation {
   *   resetPassword(resetPasswordInput: {
   *     email: "ahmed@example.com"
   *     code: "123456"
   *     newPassword: "NewPassword123!"
   *   }) {
   *     success
   *     message
   *   }
   * }
   */
  @Mutation(() => MessageResponse, {
    description: 'Réinitialiser le mot de passe avec le code reçu',
  })
  async resetPassword(
    @Args('resetPasswordInput') input: ResetPasswordInput,
  ): Promise<MessageResponse> {
    const result = await this.authService.resetPassword(input);
    return {
      success: true,
      message: result.message,
    };
  }

  /**
   * MUTATION - Renouveler le token d'accès
   * Exemple de requête :
   * mutation {
   *   refreshToken(refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...") {
   *     accessToken
   *     refreshToken
   *   }
   * }
   */
  @Mutation(() => AuthResponse, {
    description: "Renouveler le token d'accès avec un refresh token",
  })
  async refreshToken(
    @Args('refreshToken') refreshToken: string,
  ): Promise<Omit<AuthResponse, 'user'>> {
    const result = await this.authService.refreshToken(refreshToken);
    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    } as AuthResponse;
  }

  /**
   * QUERY - Test de connexion (pour vérifier que l'API fonctionne)
   * Exemple de requête :
   * query {
   *   authStatus
   * }
   */
  @Query(() => String, {
    description: "Vérifier que le module d'authentification fonctionne",
  })
  authStatus(): string {
    return "Le module d'authentification est opérationnel ! 🚀";
  }
}
