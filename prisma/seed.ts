import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {

    await prisma.recipeIngredient.deleteMany();
    await prisma.recipe.deleteMany();

    // Usamos upsert para evitar errores de duplicados
    const arroz = await prisma.ingredient.upsert({
        where: { name: 'Arroz' },
        update: {}, // Si ya existe, no hace nada
        create: { name: 'Arroz' },
    });

    const huevo = await prisma.ingredient.upsert({
        where: { name: 'Huevo' },
        update: {},
        create: { name: 'Huevo' },
    });

    // Crear la receta
    await prisma.recipe.create({
        data: {
            title: 'Arroz con Huevo',
            description: 'Un clásico rápido y nutritivo.',
            instructions: '1. Cocina el arroz. 2. Fríe el huevo. 3. Sírvelos juntos.',
            ingredients: {
                create: [
                    { ingredientId: arroz.id },
                    { ingredientId: huevo.id }
                ]
            }
        }
    });

    console.log('✅ Base de datos poblada con éxito');
    // En el archivo prisma/seed.ts, dentro de la función main():
    const restrictions = [
        { name: 'Gluten-free', description: 'Sin trigo, cebada o centeno' },
        { name: 'Vegano', description: 'Sin productos de origen animal' },
        { name: 'Sin Lactosa', description: 'Para personas intolerantes a la lactosa' },
        { name: 'Keto', description: 'Bajo en carbohidratos, alto en grasas' }
    ];

    for (const res of restrictions) {
        await prisma.medicalRestriction.upsert({
            where: { name: res.name },
            update: {},
            create: res
        });
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });