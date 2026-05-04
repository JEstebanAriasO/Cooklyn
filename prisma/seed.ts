import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const ingredientSeed = [
    { name: 'Arroz', category: 'Sin Gluten' },
    { name: 'Huevo', category: 'Proteina' },
    { name: 'Pollo', category: 'Proteina' },
    { name: 'Pasta', category: 'Gluten' },
    { name: 'Tomate', category: 'Vegetal' },
    { name: 'Cebolla', category: 'Vegetal' },
    { name: 'Ajo', category: 'Vegetal' },
    { name: 'Papa', category: 'Vegetal' },
    { name: 'Zanahoria', category: 'Vegetal' },
    { name: 'Lentejas', category: 'Legumbre' },
    { name: 'Atun', category: 'Proteina' },
    { name: 'Leche', category: 'Lacteo' },
    { name: 'Queso', category: 'Lacteo' },
    { name: 'Platano', category: 'Fruta' },
    { name: 'Frijoles', category: 'Legumbre' },
  ];

  const ingredientMap = new Map<string, string>();
  for (const ing of ingredientSeed) {
    const created = await prisma.ingredient.upsert({
      where: { name: ing.name },
      update: { category: ing.category },
      create: ing,
    });
    ingredientMap.set(ing.name, created.id);
  }

  const recipes = [
    {
      title: 'Arroz con Huevo',
      description: 'Un clasico rapido y nutritivo.',
      instructions: '1. Cocina el arroz. 2. Frie el huevo. 3. Sirvelos juntos.',
      difficulty: 'Facil',
      cookingTime: '15',
      ingredients: ['Arroz', 'Huevo'],
    },
    {
      title: 'Pollo Guisado con Papa',
      description: 'Plato casero de pollo con verduras.',
      instructions: '1. Dora el pollo. 2. Agrega papa, cebolla y tomate. 3. Cocina hasta suavizar.',
      difficulty: 'Media',
      cookingTime: '35',
      ingredients: ['Pollo', 'Papa', 'Cebolla', 'Tomate', 'Ajo'],
    },
    {
      title: 'Lentejas Estofadas',
      description: 'Lentejas reconfortantes para almuerzo.',
      instructions: '1. Cocina lentejas. 2. Sofrie ajo, cebolla y tomate. 3. Mezcla y deja espesar.',
      difficulty: 'Media',
      cookingTime: '40',
      ingredients: ['Lentejas', 'Tomate', 'Cebolla', 'Ajo', 'Zanahoria'],
    },
    {
      title: 'Pasta en Salsa de Tomate',
      description: 'Pasta sencilla con salsa natural.',
      instructions: '1. Cocina la pasta. 2. Prepara salsa con tomate, ajo y cebolla. 3. Integra y sirve.',
      difficulty: 'Facil',
      cookingTime: '25',
      ingredients: ['Pasta', 'Tomate', 'Cebolla', 'Ajo', 'Queso'],
    },
    {
      title: 'Tortilla de Papa',
      description: 'Tortilla dorada con huevo y papa.',
      instructions: '1. Cocina papa en rodajas. 2. Mezcla con huevo. 3. Cocina vuelta y vuelta.',
      difficulty: 'Facil',
      cookingTime: '20',
      ingredients: ['Papa', 'Huevo', 'Cebolla'],
    },
    {
      title: 'Ensalada de Atun',
      description: 'Receta fresca y alta en proteina.',
      instructions: '1. Mezcla atun con tomate y cebolla. 2. Ajusta sal y sirve fria.',
      difficulty: 'Facil',
      cookingTime: '10',
      ingredients: ['Atun', 'Tomate', 'Cebolla'],
    },
    {
      title: 'Sopa de Verduras',
      description: 'Sopa ligera de vegetales de despensa.',
      instructions: '1. Hierve agua con ajo. 2. Agrega zanahoria, papa y cebolla. 3. Cocina hasta ablandar.',
      difficulty: 'Facil',
      cookingTime: '30',
      ingredients: ['Papa', 'Zanahoria', 'Cebolla', 'Ajo'],
    },
    {
      title: 'Frijoles con Arroz',
      description: 'Combinacion clasica de energia y fibra.',
      instructions: '1. Cocina frijoles. 2. Prepara arroz. 3. Sirve juntos.',
      difficulty: 'Media',
      cookingTime: '45',
      ingredients: ['Frijoles', 'Arroz', 'Cebolla', 'Ajo'],
    },
    {
      title: 'Batido de Platano',
      description: 'Bebida rapida para desayuno.',
      instructions: '1. Licua platano con leche. 2. Sirve frio.',
      difficulty: 'Facil',
      cookingTime: '5',
      ingredients: ['Platano', 'Leche'],
    },
  ];

  for (const recipe of recipes) {
    await prisma.recipe.create({
      data: {
        title: recipe.title,
        description: recipe.description,
        instructions: recipe.instructions,
        difficulty: recipe.difficulty,
        cookingTime: recipe.cookingTime,
        ingredients: {
          create: recipe.ingredients.map((name) => ({
            ingredientId: ingredientMap.get(name)!,
          })),
        },
      },
    });
  }

  const restrictions = [
    { name: 'Gluten-free', description: 'Sin trigo, cebada o centeno' },
    { name: 'Vegano', description: 'Sin productos de origen animal' },
    { name: 'Sin Lactosa', description: 'Para personas intolerantes a la lactosa' },
    { name: 'Keto', description: 'Bajo en carbohidratos, alto en grasas' },
  ];

  for (const res of restrictions) {
    await prisma.medicalRestriction.upsert({
      where: { name: res.name },
      update: {},
      create: res,
    });
  }

  console.log(`✅ Seed completado: ${recipes.length} recetas nuevas agregadas`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });