// src/vacancy/vacancy.controller.ts
import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { VacancyService } from './vacancy.service';
import { AccessTokenGuard } from '../auth/access-token.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth-user.interface';

@Controller('vacancies')
@UseGuards(AccessTokenGuard)
export class VacancyController {
  constructor(private readonly vacancyService: VacancyService) {}

  @Post()
  async create(
    @Body() body: { codigo_vacante: string; titulo: string; requisitos_texto: string },
    @CurrentUser() user: AuthUser,
  ) {
    if (!user.organizationId) {
      throw new Error('Debes tener una organización registrada para crear vacantes');
    }
    return this.vacancyService.create(body, user.organizationId);
  }

  @Get()
  async findAll(@CurrentUser() user: AuthUser) {
    if (!user.organizationId) {
      return [];
    }
    return this.vacancyService.findAll(user.organizationId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    if (!user.organizationId) {
      throw new Error('Debes tener una organización registrada');
    }
    return this.vacancyService.findOne(id, user.organizationId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: { codigo_vacante?: string; titulo?: string; requisitos_texto?: string },
    @CurrentUser() user: AuthUser,
  ) {
    if (!user.organizationId) {
      throw new Error('Debes tener una organización registrada');
    }
    return this.vacancyService.update(id, body, user.organizationId);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { estado: 'activa' | 'pausada' | 'cerrada' },
    @CurrentUser() user: AuthUser,
  ) {
    if (!user.organizationId) {
      throw new Error('Debes tener una organización registrada');
    }
    return this.vacancyService.updateStatus(id, body.estado, user.organizationId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    if (!user.organizationId) {
      throw new Error('Debes tener una organización registrada');
    }
    return this.vacancyService.delete(id, user.organizationId);
  }
}
