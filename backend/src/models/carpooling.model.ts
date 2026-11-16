import fs from 'fs';
import path from 'path';

export interface RutaCarpooling {
  id: number;
  origen: string;
  destino: string;
  fecha: string;
  hora: string;
  vehiculo: string;
  cupos: number;
  precio: number;
  contacto: string;
  conductor: string;
}

const DB_PATH = path.resolve(__dirname, '../data/db.json');

export const getDb = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
export const saveDb = (data: any) =>
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
