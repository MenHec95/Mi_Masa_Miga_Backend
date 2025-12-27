// 📁 src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  
  // Swagger - usando get con tipado y valores por defecto
  const swaggerEnabled = configService.get<boolean>('swagger.enabled', true);
  const nodeEnv = configService.get<string>('nodeEnv', 'development');
  
  if (swaggerEnabled && nodeEnv !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle(configService.get<string>('swagger.title', 'Mi Masa Miga API'))
      .setDescription(configService.get<string>('swagger.description', 'API para gestión de panadería'))
      .setVersion(configService.get<string>('swagger.version', '1.0'))
      .addTag('panaderia')
      .addTag('productos')
      .addTag('clientes')
      .addBearerAuth()
      .build();
    
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(
      configService.get<string>('swagger.path', 'docs'), 
      app, 
      document
    );
  }
  
  // CORS dinámico - con valores por defecto seguros
  const corsOrigins = configService.get<string[]>('cors.origins', ['http://localhost:3000']);
  const corsMethods = configService.get<string[]>('cors.methods', ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']);
  const corsCredentials = configService.get<boolean>('cors.credentials', true);
  const corsAllowedHeaders = configService.get<string[]>('cors.allowedHeaders', ['Content-Type', 'Authorization', 'Accept']);
  
  app.enableCors({
    origin: corsOrigins,
    methods: corsMethods,
    credentials: corsCredentials,
    allowedHeaders: corsAllowedHeaders,
  });
  
  const port = configService.get<number>('port', 3000);
  await app.listen(port);
  
  console.log(`🚀 Servidor corriendo en: ${await app.getUrl()}`);
  console.log(`🌍 Entorno: ${nodeEnv}`);
  
  if (swaggerEnabled && nodeEnv !== 'production') {
    const swaggerPath = configService.get<string>('swagger.path', 'docs');
    console.log(`📚 Swagger: ${await app.getUrl()}/${swaggerPath}`);
  }
}

bootstrap();