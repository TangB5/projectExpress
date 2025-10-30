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
import contactRoutes from "./src/routes/contact.routes.js";

dotenv.config();

const app = express();

// 🔹 Security: Body parser with size limit
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 🔹 Middleware CORS robuste
const allowedOrigins = [
    'http://localhost:3001',
    'http://localhost:5000',
    'https://projectnext-eight.vercel.app',
    'https://memo-backend-sigma.vercel.app'
];

app.use((req, res, next) => {
    const origin = req.headers.origin;

    // Autoriser l'origine si elle est dans la liste ou si c'est un domaine Vercel
    if (origin && (allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin))) {
        res.header('Access-Control-Allow-Origin', origin);
    }

    res.header('Access-Control-Allow-Credentials', 'true');
    res.header(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, Cache-Control, X-Requested-With' // Ajout de headers communs
    );
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

    // Répondre immédiatement aux requêtes OPTIONS
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }

    next();
});

// 🔹 Autres middlewares
app.use(cookieParser());

// 🔹 Documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 🔹 Routes API
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/settings', settingsDevRoutes);
app.use('/api/contact', contactRoutes);

// 🔹 Route de test
app.get('/', (req, res) => {
    res.send('✅ Backend is running on Vercel and CORS is configured!');
});

// 🔹 404 Handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// 🔹 Global Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

export default app;
