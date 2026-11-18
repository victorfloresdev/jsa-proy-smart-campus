export interface Parada {
  lugar: string;
  horaAprox: string;
}

export interface RutaCarpooling {
  id?: number;
  origen: string;
  destino: string;
  fecha: string;
  hora: string;
  vehiculo: string;
  cupos: number;
  precio: number;
  contacto: string;
  conductor: string;
  pasajeros?: string[];
  paradas: Parada[];
}
