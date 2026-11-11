export type TurnoCarpooling = 'Mañana' | 'Tarde' | 'Noche';
export type EstadoRuta = 'Activa' | 'Completa' | 'Cancelada';

export interface RutaCarpooling {
  id?: number;
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

export interface FiltroCarpooling {
  terminoBusqueda: string;
  turno: string; // 'Todos' | 'Mañana' | 'Tarde' | 'Noche'
  soloDisponibles: boolean;
  soloMisRutas: boolean;
}
