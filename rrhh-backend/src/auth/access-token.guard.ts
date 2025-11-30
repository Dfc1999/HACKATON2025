import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      console.log('⛔ Guard: No se encontró token en el header Authorization');
      throw new UnauthorizedException('Token no encontrado');
    }

    try {
      const secret = this.configService.get<string>('JWT_SECRET');

      const payload = await this.jwtService.verifyAsync(token, {
        secret: secret,
      });

      console.log('✅ Guard: Token válido para usuario:', payload.email);
      request.user = payload;
      return true;

    } catch (error) {
      // ESTO TE DIRÁ EL ERROR EXACTO EN LA CONSOLA DEL BACKEND
      console.error('⛔ Guard: Token rechazado. Razón:', error.message);
      throw new UnauthorizedException('Token inválido: ' + error.message);
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
