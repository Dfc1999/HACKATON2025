import { Controller, Post, Get, Body, Query, Param } from '@nestjs/common';
import { ApplicationService } from './application.service';

@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  // Endpoint para crear postulación inicial (cuando envían el CV)
  @Post()
  async create(@Body() body: { email: string; nombre: string; vacante_codigo: string }) {
    return this.applicationService.create(body);
  }

  // Webhook para recibir updates de Logic Apps
  @Post('webhook')
  async webhook(@Body() body: {
    email: string;
    vacante_codigo: string;
    estado: string;
    mensaje: string;
    detalles?: string;
  }) {
    console.log('📥 Webhook recibido desde Logic Apps:', body);
    return this.applicationService.updateFromWebhook(body);
  }

  // Obtener todas las postulaciones de un email
  @Get('track')
  async getTracking(@Query('email') email: string) {
    if (!email) {
      return { error: 'Email requerido' };
    }
    return this.applicationService.getByEmail(email);
  }

  // Obtener una postulación específica
  @Get('track/:email/:codigo')
  async getOne(
    @Param('email') email: string,
    @Param('codigo') codigo: string
  ) {
    return this.applicationService.getOne(email, codigo);
  }
}
