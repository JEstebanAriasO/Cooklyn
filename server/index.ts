import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const app = express();
const prisma = new PrismaClient();
const JWT_SECRET = 'tu_llave_secreta_super_segura'; // En producción, esto va en un archivo .env

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
        const myIngredientIds = userInventory.map((i: { ingredientId: number }) => i.ingredientId);

        // 2. Obtener recetas que coincidan parcial o totalmente
        const recipes = await prisma.recipe.findMany({
            include: { ingredients: true }
        });

        const matches = recipes.filter((recipe: any) =>
            recipe.ingredients.every((ri: any) => myIngredientIds.includes(ri.ingredientId))
        );

        res.json(matches);
    } catch (error) {
        res.status(500).json({ error: 'Error en el emparejamiento' });
    }
});

app.get('/api/recipes/:id', async (req, res) => {
    const { id } = req.params;
    const recipe = await prisma.recipe.findUnique({
        where: { id },
        include: { ingredients: { include: { ingredient: true } } }
    });
    res.json(recipe);
});

// Obtener el detalle de una receta específica
app.get('/api/recipes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const recipe = await prisma.recipe.findUnique({
            where: { id },
            include: {
                ingredients: {
                    include: { ingredient: true }
                }
            }
        });
        if (!recipe) return res.status(404).json({ error: 'Receta no encontrada' });
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el detalle de la receta' });
    }
});

// server/index.ts
app.get('/api/restrictions', async (req, res) => {
    try {
        const restrictions = await prisma.medicalRestriction.findMany();
        res.json(restrictions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno' });
    }
});

// --- ENDPOINT DE REGISTRO ---
app.post('/api/auth/register', async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { email, password: hashedPassword, name }
        });
        res.json({ message: 'Usuario creado', userId: user.id });
    } catch (error) {
        res.status(400).json({ error: 'El correo ya está registrado' });
    }
});

// --- ENDPOINT DE LOGIN ---
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ error: 'Contraseña incorrecta' });

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});     