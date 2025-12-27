// 📁 src/config/configuration.ts
export default () => ({
  // Entorno
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  
  // CORS
  cors: {
    origins: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
      : ['http://localhost:3000', 'http://localhost:4200'],
    credentials:
      process.env.CORS_CREDENTIALS === 'true' ||
      process.env.NODE_ENV === 'development',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  },
  
  // Base de datos
  database: {
    url: process.env.DATABASE_URL || '',
    ssl: true,
  },
  
  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  
  // Swagger - CON VALORES EXPLÍCITOS
  swagger: {
    enabled: process.env.SWAGGER_ENABLED !== 'false',
    path: process.env.SWAGGER_PATH || 'docs',
    title: process.env.SWAGGER_TITLE || 'Mi Masa Miga API',
    description: process.env.SWAGGER_DESCRIPTION || 'API para gestión de panadería',
    version: process.env.SWAGGER_VERSION || '1.0',
  },
});