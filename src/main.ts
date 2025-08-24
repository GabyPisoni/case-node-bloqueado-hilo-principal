import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS para pruebas
  app.enableCors();
  
  // Configurar el puerto
  const port = process.env.PORT || 3000;
  
  await app.listen(port);
  console.log(`🚀 Aplicación ejecutándose en: http://localhost:${port}`);
  console.log(`📊 Endpoint de bloqueo: http://localhost:${port}/blocking`);
  console.log(`⚡ Endpoint de estado: http://localhost:${port}/status`);
}
bootstrap();
