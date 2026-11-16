import fs from 'fs';
import path from 'path';

export type TurnoCarpooling = 'Mañana' | 'Tarde' | 'Noche';
export type EstadoRuta = 'Activa' | 'Completa' | 'Cancelada';

export interface RutaCarpooling {
  id: number;
  origen: string;
  destino: string;
  puntosIntermedios: string;
  fechaSalida: string;
  horaSalida: string;
  turno: TurnoCarpooling;
  vehiculo: string;
  asientosTotales: number;
  asientosDisponibles: number;
  aporteSugerido: number;
  telefonoContacto: string;
  estado: EstadoRuta;
  autor: string;
  pasajeros: string[];
  observaciones?: string;
}

const DB_PATH = path.resolve(__dirname, '../data/db.json');

export const getDb = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
export const saveDb = (data: any) =>
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
