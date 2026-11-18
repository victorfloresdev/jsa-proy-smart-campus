import fs from 'fs';
import path from 'path';

export interface Reserva {
  id?: number;
  espacio: string;
  tipoEspacio: string;
  fecha: string;
  bloqueHorario: string;
  motivo: string;
  cantidadPersonas: number;
  estado: 'Confirmada' | 'Pendiente';
  autor: string;
}

const DB_PATH = path.resolve(__dirname, '../data/db.json');

export const getDb = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
export const saveDb = (data: any) =>
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');