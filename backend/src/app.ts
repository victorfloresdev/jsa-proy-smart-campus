import express, { Request, Response } from 'express';
import cors from 'cors';
import carpoolingRoutes from './routes/carpooling.routes';

const app = express();

// 1. Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Ruta de comprobación de salud
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API Smart Campus activa' });
});

// 3. Montaje de rutas de módulos
app.use('/rutas', carpoolingRoutes);

export default app;
