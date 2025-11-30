import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';

// Módulos de Funcionalidad
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrganizationModule } from './organization/organization.module';

// Controladores y Servicios existentes
import { ExamController } from './exam/exam.controller';
import { ExamService } from './exam/exam.service';
import { ProctoringController } from './proctoring/proctoring.controller';
import { ProctoringService } from './proctoring/proctoring.service';

// Controladores y Servicios de Subida de Archivos
import { UploadController } from './upload/upload.controller';
import { BlobService } from './blob/blob.service';
import { VacancyModule } from './vacancy/vacancy.module';
import { ApplicationModule } from './application/application.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Carga .env
    DatabaseModule,
    // 👇 IMPORTANTE: Registrar los nuevos módulos aquí
    AuthModule,
    UsersModule,
    OrganizationModule,
    VacancyModule,
    ApplicationModule
  ],
  controllers: [
    ExamController,
    ProctoringController,
    UploadController // 👈 Agregado para que funcione la subida
  ],
  providers: [
    ExamService,
    ProctoringService,
    BlobService // 👈 Agregado para que funcione Azure Blob
  ],
})
export class AppModule {}
