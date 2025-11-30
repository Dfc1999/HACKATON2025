import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AccessTokenGuard } from './access-token.guard';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        global: true, // Esto ayuda, pero exportarlo es más seguro
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  providers: [AuthService, AccessTokenGuard],
  controllers: [AuthController],
  // 👇 AQUÍ ESTÁ LA SOLUCIÓN: Agrega JwtModule a los exports
  exports: [AccessTokenGuard, JwtModule],
})
export class AuthModule {}
