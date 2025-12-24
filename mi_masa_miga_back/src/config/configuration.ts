// 📁 src/config/configuration.ts
export default () => ({
  // Entorno
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  
  // CORS - Parsear lista de orígenes
  cors: {
    origins: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',')
      : ['http://localhost:3000'],
    credentials: process.env.NODE_ENV === 'production',
  },
  
  // Base de datos
  database: {
    url: process.env.DATABASE_URL,
  },
  
  // Seguridad
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '1d',
  },
});