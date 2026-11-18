import fs from 'fs';
import path from 'path';

export type PrioridadTicket = 'Baja' | 'Media' | 'Alta';
export type EstadoTicket = 'Pendiente' | 'En Revisión' | 'Resuelto';

export interface Ticket {
  id: number;
  titulo: string;
  ambiente: string;
  pabellon: string;
  prioridad: PrioridadTicket;
  descripcion: string;
  estado: EstadoTicket;
  fechaReporte: string;
  autor: string;
}

export type NuevoTicket = Omit<Ticket, 'id'>;

export interface SmartCampusDb {
  tickets?: Ticket[];
  [coleccion: string]: unknown;
}

const resolveDbPath = (): string => {
  const directPath = path.resolve(__dirname, '../data/db.json');
  if (fs.existsSync(directPath)) {
    return directPath;
  }
  const srcPath = path.resolve(__dirname, '../../src/data/db.json');
  if (fs.existsSync(srcPath)) {
    return srcPath;
  }
  const cwdSrcPath = path.resolve(process.cwd(), 'src/data/db.json');
  if (fs.existsSync(cwdSrcPath)) {
    return cwdSrcPath;
  }
  return directPath;
};

export const getDb = (): SmartCampusDb =>
  JSON.parse(fs.readFileSync(resolveDbPath(), 'utf-8')) as SmartCampusDb;

export const saveDb = (data: SmartCampusDb): void =>
  fs.writeFileSync(resolveDbPath(), JSON.stringify(data, null, 2), 'utf-8');
