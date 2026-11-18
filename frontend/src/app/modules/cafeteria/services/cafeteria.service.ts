import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Pedido, PlatoMenu } from '../models/pedido.model';

@Injectable({
  providedIn: 'root'
})
export class CafeteriaService {
  private readonly apiUrl = 'http://localhost:3000/pedidos';

  readonly menuDelDia: PlatoMenu[] = [
    { plato: 'Lomo Saltado Ejecutivo', categoria: 'Almuerzos', precio: 14.50 },
    { plato: 'Pollo a la Plancha con Ensalada', categoria: 'Almuerzos', precio: 12.00 },
    { plato: 'Arroz Chaufa Especial', categoria: 'Almuerzos', precio: 13.00 },
    { plato: 'Jugo de Maracuyá', categoria: 'Bebidas', precio: 5.00 },
    { plato: 'Sándwich Triple', categoria: 'Sándwiches', precio: 7.50 },
    { plato: 'Jugo de Maracuyá + Sándwich Triple', categoria: 'Combos', precio: 9.50 }
  ];

  private readonly _pedidos = signal<Pedido[]>([]);
  private readonly _cargando = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly pedidos = this._pedidos.asReadonly();
  readonly cargando = this._cargando.asReadonly();
  readonly error = this._error.asReadonly();

  constructor(private http: HttpClient) {}

  listar(): void {
    this._cargando.set(true);
    this._error.set(null);

    this.http.get<Pedido[]>(this.apiUrl).subscribe({
      next: (pedidos) => {
        this._pedidos.set(pedidos);
        this._cargando.set(false);
      },
      error: () => {
        this._error.set('No se pudieron cargar los pedidos.');
        this._cargando.set(false);
      }
    });
  }

  crear(pedido: Omit<Pedido, 'id'>): Observable<Pedido> {
    return this.http.post<Pedido>(this.apiUrl, pedido).pipe(
      tap(() => this.listar())
    );
  }

  marcarEntregado(id: number): Observable<Pedido> {
    return this.http.patch<Pedido>(`${this.apiUrl}/${id}`, {
      estado: 'Entregado'
    }).pipe(
      tap(() => this.listar())
    );
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.listar())
    );
  }
}