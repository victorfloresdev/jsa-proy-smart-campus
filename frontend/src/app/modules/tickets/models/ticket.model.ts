export type PrioridadTicket = 'Baja' | 'Media' | 'Alta';
export type EstadoTicket = 'Pendiente' | 'En Revisión' | 'Resuelto';

export interface Ticket {
  id?: number;
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
