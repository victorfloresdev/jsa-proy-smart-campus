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

export interface EspacioCampus {
  nombre: string;
  tipo: string;
}

export const ESPACIOS_CAMPUS: EspacioCampus[] = [
  { nombre: 'Cubículo de Estudio B-104', tipo: 'Sala de Estudio' },
  { nombre: 'Laboratorio de Redes A-202', tipo: 'Laboratorio' },
  { nombre: 'Sala de Dibujo C-101', tipo: 'Taller' },
  { nombre: 'Losa Deportiva 1', tipo: 'Deportivo' }
];

export const BLOQUES_HORARIOS: string[] = [
  '08:00 - 10:00',
  '10:00 - 12:00',
  '12:00 - 14:00',
  '14:00 - 16:00',
  '16:00 - 18:00',
  '18:00 - 20:00'
];