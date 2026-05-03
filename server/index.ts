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

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});     