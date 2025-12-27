// 📁 src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';

@Module({
  imports: [
    // Configuración de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true, // Esto hace que ConfigService esté disponible globalmente
      load: [configuration], // Carga tu configuración personalizada
      envFilePath: '.env', // Ruta de tu archivo .env
    }),
    AuthModule,
    // ... otros módulos que tengas
  ],
  controllers: [], // Tus controladores
  providers: [], // Tus servicios
})
export class AppModule {}
