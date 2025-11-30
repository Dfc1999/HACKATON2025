// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async login(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) throw new UnauthorizedException('Credenciales inválidas');

    const payload = { sub: user._id, email: user.email, organizationId: user.organizationId };
    return {
      access_token: this.jwtService.sign(payload),
      user: { email: user.email, name: user.name, hasOrg: !!user.organizationId }
    };
  }

  async register(email: string, pass: string, name: string) {
    const existing = await this.usersService.findByEmail(email);
    if (existing) throw new ConflictException('El usuario ya existe');

    const user = await this.usersService.create({ email, password: pass, name });

    const payload = { sub: user._id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: { email: user.email, name: user.name, hasOrg: false }
    };
  }
}
