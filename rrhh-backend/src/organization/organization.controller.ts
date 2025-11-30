import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { AccessTokenGuard } from '../auth/access-token.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth-user.interface';

@Controller('organization')
@UseGuards(AccessTokenGuard)
export class OrganizationController {
  constructor(private readonly orgService: OrganizationService) {}

  @Post()
  async createOrganization(
    @Body() body: { name: string; industry: string; description: string },
    @CurrentUser() user: AuthUser,
  ) {
    return await this.orgService.create(body, user.sub);
  }

  @Get('me')
  async getMyOrganization(@CurrentUser() user: AuthUser) {
    const org = await this.orgService.findByOwner(user.sub);
    if (!org) return { hasOrganization: false };
    return { hasOrganization: true, data: org };
  }
}
