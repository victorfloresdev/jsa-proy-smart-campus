import express, { Request, Response } from 'express';
import cors from 'cors';
import carpoolingRoutes from './routes/carpooling.routes';
import objetoRoutes from './routes/objeto.routes';
import reservaRoutes from './routes/reserva.routes';
import ticketRoutes from './routes/ticket.routes';
import pedidoRoutes from './routes/pedido.routes';
const app = express();

// 1. Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Ruta de comprobación de salud
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API Smart Campus activa' });
});


// 3. Montaje de rutas modulares
app.use('/objetos', objetoRoutes);
app.use('/rutas', carpoolingRoutes);
app.use('/reservas', reservaRoutes);
app.use('/tickets', ticketRoutes);
app.use('/pedidos', pedidoRoutes);

export default app;