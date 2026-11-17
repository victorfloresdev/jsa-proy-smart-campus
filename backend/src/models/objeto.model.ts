import fs from 'fs';
import path from 'path';

export type TipoReporte = 'Perdido' | 'Encontrado';
export type EstadoObjeto = 'Activo' | 'Recuperado';

export interface ObjetoPerdido {
  id: number;
  titulo: string;
  tipo: TipoReporte;
  categoria: string;
  ubicacion: string;
  fechaSuceso: string;
  descripcion: string;
  imagenUrl: string;
  estado: EstadoObjeto;
  contacto: string;
  autor: string;
}

export type NuevoObjeto = Omit<ObjetoPerdido, 'id'>;

export interface SmartCampusDb {
  objetos?: ObjetoPerdido[];
  [coleccion: string]: unknown;
}

const DB_PATH = path.resolve(__dirname, '../data/db.json');

export const getDb = (): SmartCampusDb =>
  JSON.parse(fs.readFileSync(DB_PATH, 'utf-8')) as SmartCampusDb;

export const saveDb = (data: SmartCampusDb): void =>
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
