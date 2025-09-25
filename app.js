import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './src/swagger.js';

// Importez vos routes ici
import productRoutes from './src/routes/product.routes.js';
import userRoutes from './src/routes/user.routes.js';
import authRoutes from './src/routes/auth.routes.js';
import orderRoutes from './src/routes/order.routes.js';

dotenv.config();

const app = express();

// Middleware CORS
const allowedOrigins = [
    'http://localhost:3001',
    'https://projectnext-eight.vercel.app',
    'https://memo-backend-sigma.vercel.app'
];
const corsOptions = {
    origin: (origin, callback) => {
        // Autorise les requêtes sans origine (comme les requêtes de Postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Très important pour les cookies et les tokens
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// Intégration de la documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

app.get("/", (req, res) => {
    res.send("Backend is running on Vercel!");
});

export default app;