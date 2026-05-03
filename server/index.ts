import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

// Añade este bloque para probar la conexión al arrancar
async function testConnection() {
    try {
        await prisma.$connect();
        console.log("✅ Conexión a MySQL exitosa desde el servidor");
    } catch (e) {
        console.error("❌ No se pudo conectar a MySQL:", e);
        process.exit(1);
    }
}

testConnection();


const PORT = 3000;

app.use(cors());
app.use(express.json());

// Ruta de prueba para verificar que el backend funciona
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Servidor de Cooklyn operando' });
});

// --- RUTAS DE INGREDIENTES ---

// Obtener todos los ingredientes de la despensa
app.get('/api/ingredients', async (req, res) => {
    try {
        const ingredients = await prisma.ingredient.findMany();
        res.json(ingredients);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener ingredientes' });
    }
});

// Agregar un nuevo ingrediente
app.post('/api/ingredients', async (req, res) => {
    const { name, category } = req.body;
    try {
        const newIngredient = await prisma.ingredient.create({
            data: { name, category },
        });
        res.json(newIngredient);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear ingrediente' });
    }
});

app.get('/api/recipes', async (req, res) => {
    try {
        const recipes = await prisma.recipe.findMany({
            include: {
                ingredients: {
                    include: { ingredient: true }
                }
            }
        });
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener recetas' });
    }
});

// Lógica de "Qué puedo cocinar hoy"
app.get('/api/recipes/match/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        // 1. Obtener el inventario del usuario
        const userInventory = await prisma.inventory.findMany({
            where: { userId },
            select: { ingredientId: true }
        });
        const myIngredientIds = userInventory.map(i => i.ingredientId);

        // 2. Obtener recetas que coincidan parcial o totalmente
        const recipes = await prisma.recipe.findMany({
            include: { ingredients: true }
        });

        const matches = recipes.filter(recipe =>
            recipe.ingredients.every(ri => myIngredientIds.includes(ri.ingredientId))
        );

        res.json(matches);
    } catch (error) {
        res.status(500).json({ error: 'Error en el emparejamiento' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});     