import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const app = express();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'cooklyn_secret_key_2026';
const PORT = 3000;

app.use(cors());
app.use(express.json());

// --- CONEXIÓN INICIAL ---
async function connectDB() {
    try {
        await prisma.$connect();
        console.log(" Servidor Cooklyn conectado a MySQL");
    } catch (e) {
        console.error(" Error de conexión:", e);
        process.exit(1);
    }
}
connectDB();

// --- AUTENTICACIÓN ---
app.post('/api/auth/register', async (req, res) => {
    const { email, password, name, restrictionIds } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                ...(Array.isArray(restrictionIds) && restrictionIds.length > 0
                    ? {
                        restrictions: {
                            create: restrictionIds.map((id: string) => ({ restrictionId: id })),
                        },
                    }
                    : {}),
            },
        });
        res.json({ message: 'Usuario creado', userId: user.id });
    } catch (e) {
        res.status(400).json({ error: 'Error en registro' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).send();
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({
            token,
            user: { id: user.id, name: user.name ?? '', email: user.email },
        });
    } catch (e) {
        res.status(500).send();
    }
});

// --- INVENTARIO ---
app.get('/api/inventory/:userId', async (req, res) => {
    const items = await prisma.inventory.findMany({ where: { userId: req.params.userId }, include: { ingredient: true } });
    res.json(items);
});

app.post('/api/inventory', async (req, res) => {
    const { userId, ingredientId, quantity } = req.body;
    try {
        const item = await prisma.inventory.upsert({
            where: { userId_ingredientId: { userId, ingredientId } },
            update: { quantity },
            create: { userId, ingredientId, quantity }
        });
        res.json(item);
    } catch (e) { res.status(500).send(); }
});

app.delete('/api/inventory/:id', async (req, res) => {
    await prisma.inventory.delete({ where: { id: req.params.id } });
    res.json({ success: true });
});

// --- RECETAS Y CÁLCULOS ---
app.get('/api/recipes', async (req, res) => {
    const recipes = await prisma.recipe.findMany({ include: { ingredients: { include: { ingredient: true } } } });
    res.json(recipes);
});

app.get('/api/recipes/:id', async (req, res) => {
    const recipe = await prisma.recipe.findUnique({
        where: { id: req.params.id },
        include: { ingredients: { include: { ingredient: true } } }
    });
    recipe ? res.json(recipe) : res.status(404).send();
});

// NUEVA: Ruta de ingredientes faltantes (Arregla el error de tu captura)
app.get('/api/recipes/:recipeId/missing-ingredients/:userId', async (req, res) => {
    const { recipeId, userId } = req.params;
    try {
        const recipeIngs = await prisma.recipeIngredient.findMany({ where: { recipeId } });
        const userInv = await prisma.inventory.findMany({ where: { userId }, select: { ingredientId: true } });
        const myIds = userInv.map(i => i.ingredientId);

        const missing = await prisma.recipeIngredient.findMany({
            where: { recipeId, NOT: { ingredientId: { in: myIds } } },
            include: { ingredient: true }
        });
        res.json(missing);
    } catch (e) { res.status(500).send(); }
});

// --- HISTORIAL Y FAVORITOS ---
app.post('/api/recipes/cook', async (req, res) => {
    const { userId, recipeId } = req.body;
    try {
        await prisma.$transaction(async (tx) => {
            const recipe = await tx.recipe.findUnique({ where: { id: recipeId }, include: { ingredients: true } });
            if (recipe) {
                for (const ri of recipe.ingredients) {
                    await tx.inventory.deleteMany({ where: { userId, ingredientId: ri.ingredientId } });
                }
                await tx.history.create({ data: { userId, recipeId } });
            }
        });
        res.json({ success: true });
    } catch (e) { res.status(500).send(); }
});

app.get('/api/history/:userId', async (req, res) => {
    const hist = await prisma.history.findMany({ where: { userId: req.params.userId }, include: { recipe: true }, orderBy: { cookedAt: 'desc' } });
    res.json(hist);
});

app.post('/api/favorites/toggle', async (req, res) => {
    const { userId, recipeId } = req.body;
    const exists = await prisma.favorite.findFirst({ where: { userId, recipeId } });
    if (exists) {
        await prisma.favorite.delete({ where: { id: exists.id } });
        res.json({ isFavorite: false });
    } else {
        await prisma.favorite.create({ data: { userId, recipeId } });
        res.json({ isFavorite: true });
    }
});

app.get('/api/favorites/:userId', async (req, res) => {
    const favs = await prisma.favorite.findMany({ where: { userId: req.params.userId }, include: { recipe: true } });
    res.json(favs.map(f => f.recipe));
});

// --- AUXILIARES (Arreglan el error 404 de restricciones)[cite: 3] ---
app.get('/api/restrictions', async (req, res) => {
    const resList = await prisma.medicalRestriction.findMany();
    res.json(resList);
});

app.get('/api/ingredients/search', async (req, res) => {
    const { q } = req.query;
    const ings = await prisma.ingredient.findMany({ where: { name: { contains: String(q) } }, take: 10 });
    res.json(ings);
});

app.listen(PORT, () => console.log(`🚀 Cooklyn corriendo en http://localhost:${PORT}`));