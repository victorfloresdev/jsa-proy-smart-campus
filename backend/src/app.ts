import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import objetoRoutes from './routes/objeto.routes';

const app: Application = express();

// 1. Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Ruta base de salud / comprobación
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API Smart Campus activa' });
});

// 3. Montaje de rutas modulares
app.use('/objetos', objetoRoutes);

export default app;