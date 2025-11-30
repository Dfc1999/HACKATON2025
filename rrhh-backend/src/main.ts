import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express'; // 👈 Importa urlencoded también

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. CORS permisivo para desarrollo (evita bloqueos entre puerto 3000 y 3001)
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // 2. Aumentar límite de tamaño para evitar "Payload Too Large"
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Backend RRHH corriendo en: http://localhost:${port}`);
}
bootstrap();
