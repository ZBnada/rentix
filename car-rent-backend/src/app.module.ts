import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { DateTimeResolver } from 'graphql-scalars'; // ✅ AJOUTER
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { AuthModule } from './auth/auth.module';
import { VerificationCodeModule } from './verification-code/verification-code.module';
import { EmailModule } from './email/email.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { VehiculeModule } from './vehicule/vehicule.module';
import { MarqueVehiculeModule } from './marque-vehicule/marque-vehicule.module';
import { EntretienASuivreModule } from './entretien-asuivre/entretien-a-suivre.module';
import { TypeEntretienModule } from './type-entretien/type-entretien.module';
import { NotificationModule } from './notification/notification.module';
import { ModePaiementModule } from './mode-paiement/mode-paiement.module';
import { AssuranceModule } from './assurance/assurance.module';
import { CarnetEntretienModule } from './carnet-entretien/carnet-entretien.module';
import { VignetteModule } from './vignette/vignette.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // Configuration TypeORM avec MySQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST') || 'localhost',
        port: configService.get<number>('DB_PORT') || 3306,
        username: configService.get<string>('DB_USERNAME') || 'root',
        password: configService.get<string>('DB_PASSWORD') || '',
        database: configService.get<string>('DB_DATABASE') || 'car_rental',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        logging: configService.get<boolean>('DB_LOGGING') || false,
        charset: 'utf8mb4',
        timezone: '+00:00',
      }),
    }),
    // Configuration GraphQL Code-First
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: false,
      introspection: true,
      csrfPrevention: false,
      resolvers: { DateTime: DateTimeResolver }, // ✅ AJOUTER CETTE LIGNE
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      context: ({ req, res }) => ({ req, res }),
      formatError: (error) => ({
        message: error.message,
        code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
        path: error.path,
      }),
      //  Ceci active Apollo Sandbox
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),

    // Modules fonctionnels
    RoleModule,
    UserModule,
    VerificationCodeModule,
    EmailModule,
    AuthModule,
    VehiculeModule,
    MarqueVehiculeModule,
    EntretienASuivreModule,
    TypeEntretienModule,
    NotificationModule,
    ModePaiementModule,
    AssuranceModule,
    CarnetEntretienModule,
    VignetteModule,
  ],
})
export class AppModule {}
