import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './src/docs/swagger.js';

// Import des routes
import productRoutes from './src/routes/product.routes.js';
import userRoutes from './src/routes/user.routes.js';
import authRoutes from './src/routes/auth.routes.js';
import orderRoutes from './src/routes/order.routes.js';
import settingsDevRoutes from './src/routes/settings.routes.js';

dotenv.config();

const app = express();

// 🔹 Liste des origines autorisées
const allowedOrigins = [
    'http://localhost:3001',
    'http://localhost:5000',
    'https://projectnext-eight.vercel.app',
    'https://memo-backend-sigma.vercel.app'
];

// 🔹 Middleware CORS (version robuste pour Vercel)
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && (allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin))) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
});

// 🔹 Autres middlewares
app.use(express.json());
app.use(cookieParser());

// 🔹 Documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 🔹 Routes API
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/settings', settingsDevRoutes);
// 🔹 Route de test
app.get('/', (req, res) => {
    res.send('✅ Backend is running on Vercel and CORS is configured!');
});

export default app;
