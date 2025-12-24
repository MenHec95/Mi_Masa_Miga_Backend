import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Pipe de validación global (importante para DTOs)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no decoradas en DTOs
      forbidNonWhitelisted: true, // Lanza error si hay propiedades no permitidas
      transform: true, // Transforma los tipos automáticamente
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  
  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Mi Masa Miga API')
    .setDescription('API para la gestión de panadería Mi Masa Miga')
    .setVersion('1.0')
    .addTag('panaderia')
    .addTag('productos')
    .addTag('clientes')
    // Descomenta si usas autenticación:
    // .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // Configurar Swagger UI
  SwaggerModule.setup('docs', app, document, {
    explorer: true,
    swaggerOptions: {
      filter: true,
      showRequestDuration: true,
    },
  });
  
  // Habilitar CORS (si es necesario)
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:4200'], // Ajusta según necesites
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`Aplicación ejecutándose en: ${await app.getUrl()}`);
  console.log(
    `Documentación Swagger disponible en: ${await app.getUrl()}/docs`,
  );
}

bootstrap();