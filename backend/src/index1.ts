import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;


app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

interface Reserva {
  id: number;
  espacio: string;
  tipoEspacio: string;
  fecha: string;
  bloqueHorario: string;
  motivo: string;
  cantidadPersonas: number;
  estado: 'Confirmada' | 'Pendiente';
  autor: string;
}


const FILE_PATH = path.join(__dirname, '../../db.json');

let dbData: any = {};

const cargarDatos = () => {
  try {
    const contenido = fs.readFileSync(FILE_PATH, 'utf-8');
    dbData = JSON.parse(contenido);
  } catch (error) {
    console.error('Error al leer db.json:', error);
    dbData = { reservas: [] };
  }
};

const guardarEnDisco = () => {
  fs.writeFileSync(FILE_PATH, JSON.stringify(dbData, null, 2), 'utf-8');
};


cargarDatos();


app.get('/reservas', (req: Request, res: Response) => {
  cargarDatos();
  res.json(dbData.reservas || []);
});


app.post('/reservas', (req: Request, res: Response) => {
  cargarDatos();
  const reservas: Reserva[] = dbData.reservas || [];
  const nuevoId = reservas.length > 0 ? Math.max(...reservas.map((r) => r.id)) + 1 : 1;
  const nuevaReserva: Reserva = { id: nuevoId, ...req.body };

  reservas.push(nuevaReserva);
  dbData.reservas = reservas;
  guardarEnDisco();

  res.status(201).json(nuevaReserva);
});

app.delete('/reservas/:id', (req: Request, res: Response) => {
  cargarDatos();
  const id = Number(req.params.id);
  const reservas: Reserva[] = dbData.reservas || [];
  const index = reservas.findIndex((r) => r.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Reserva no encontrada' });
  }

  const [eliminada] = reservas.splice(index, 1);
  dbData.reservas = reservas;
  guardarEnDisco();

  res.json(eliminada);
});

app.listen(port, () => {
  console.log(`Servidor Express con db.json corriendo en http://localhost:${port}`);
});