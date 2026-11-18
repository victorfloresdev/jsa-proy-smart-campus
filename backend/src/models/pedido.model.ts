
export type EstadoPedido =
  | 'En preparación'
  | 'Entregado';

export interface Pedido {
  id: number;
  plato: string;
  categoria: string;
  precio: number;
  cantidad: number;
  total: number;
  fecha: string;
  estado: EstadoPedido;
  autor: string;
}

export type NuevoPedido = Omit<Pedido, 'id'>;
