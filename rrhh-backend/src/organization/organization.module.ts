import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { UsersModule } from '../users/users.module'; // 👈 Necesario para usar UsersService
import { AuthModule } from '../auth/auth.module';   // 👈 Necesario para usar el AccessTokenGuard

@Module({
  imports: [UsersModule, AuthModule],
  controllers: [OrganizationController],
  providers: [OrganizationService],
})
export class OrganizationModule {}
