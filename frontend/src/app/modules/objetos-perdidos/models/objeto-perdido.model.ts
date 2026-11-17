export type TipoReporte = 'Perdido' | 'Encontrado';
export type EstadoObjeto = 'Activo' | 'Recuperado';
export type FiltroTipoObjeto = 'Todos' | 'Perdidos' | 'Encontrados';

export interface ObjetoPerdido {
  id?: number;
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