import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando seed...');

    // Crear usuario admin
    const hashedPassword = await bcrypt.hash('Admin123!', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@mimasamiga.com' },
        update: {},
        create: {
            email: 'admin@mimasamiga.com',
            password: hashedPassword,
            name: 'Administrador',
            userName: 'admin',
            role: 'ADMIN',
        },
    });

    console.log('✅ Usuario admin creado:', admin.email);

    // COMENTAR ESTO HASTA QUE AGREGUES EL MODELO CATEGORY
    /*
    const categories = [
      { name: 'Recetas', slug: 'recetas', description: 'Recetas de masa madre' },
      { name: 'Técnicas', slug: 'tecnicas', description: 'Técnicas de panificación' },
      { name: 'Herramientas', slug: 'herramientas', description: 'Herramientas y utensilios' },
      { name: 'Tips', slug: 'tips', description: 'Consejos y trucos' },
    ];
  
    for (const category of categories) {
      await prisma.category.upsert({
        where: { slug: category.slug },
        update: {},
        create: category,
      });
    }
  
    console.log('✅ Categorías creadas');
    */

    console.log('🎉 Seed completado!');
}

main()
    .catch((e) => {
        console.error('❌ Error en seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });