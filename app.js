import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './src/docs/swagger.js';

// Importez vos routes ici
import productRoutes from './src/routes/product.routes.js';
import userRoutes from './src/routes/user.routes.js';
import authRoutes from './src/routes/auth.routes.js';
import orderRoutes from './src/routes/order.routes.js';

const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:3001',
  'https://projectnext-eight.vercel.app'
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
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