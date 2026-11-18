import express from 'express';
import cors from 'cors';
import pedidoRoutes from './routes/pedido.routes';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta principal
app.get('/', (req, res) => {
  res.send('API SmartCampus funcionando correctamente');
});

// Rutas de Cafetería
app.use('/pedidos', pedidoRoutes);

export default app;