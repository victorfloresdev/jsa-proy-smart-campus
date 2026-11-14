import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Reserva, ESPACIOS_CAMPUS, BLOQUES_HORARIOS } from '../models/reserva.model';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/reservas';

  readonly espacios = ESPACIOS_CAMPUS;
  readonly bloques = BLOQUES_HORARIOS;

  private _reservas = signal<Reserva[]>([]);
  private _cargando = signal<boolean>(false);
  private _error = signal<string | null>(null);

  readonly reservas = this._reservas.asReadonly();
  readonly cargando = this._cargando.asReadonly();
  readonly error = this._error.asReadonly();

  constructor() {
    this.listar();
  }

  listar(): void {
    this._cargando.set(true);
    this._error.set(null);
    this.http.get<Reserva[]>(this.apiUrl).subscribe({
      next: (data) => {
        this._reservas.set(data);
        this._cargando.set(false);
      },
      error: () => {
        this._error.set('Error al cargar las reservas');
        this._cargando.set(false);
      }
    });
  }

  crear(reserva: Omit<Reserva, 'id'>): Observable<Reserva> {
    return this.http.post<Reserva>(this.apiUrl, reserva).pipe(
      tap(() => this.listar())
    );
  }

  cancelar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.listar())
    );
  }
}