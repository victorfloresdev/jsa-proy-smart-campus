import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Ticket, EstadoTicket, NuevoTicket } from '../models/ticket.model';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/tickets';

  private readonly _tickets = signal<Ticket[]>([]);
  private readonly _cargando = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly tickets = this._tickets.asReadonly();
  readonly cargando = this._cargando.asReadonly();
  readonly error = this._error.asReadonly();

  listar(): void {
    this._cargando.set(true);
    this._error.set(null);

    this.http.get<Ticket[]>(this.apiUrl).subscribe({
      next: (datos) => {
        this._tickets.set(datos);
        this._cargando.set(false);
      },
      error: (err) => {
        console.error('Error al listar tickets:', err);
        this._error.set('No se pudo cargar la lista de tickets de mantenimiento.');
        this._cargando.set(false);
      },
    });
  }

  obtener(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}/${id}`);
  }

  crear(ticket: NuevoTicket): Observable<Ticket> {
    this._error.set(null);
    return this.http.post<Ticket>(this.apiUrl, ticket).pipe(
      tap(() => this.listar()),
      catchError((err) => {
        this._error.set('Error al registrar el ticket de mantenimiento.');
        return throwError(() => err);
      })
    );
  }

  actualizarEstado(id: number, nuevoEstado: EstadoTicket): Observable<Ticket> {
    this._error.set(null);
    return this.http
      .patch<Ticket>(`${this.apiUrl}/${id}`, { estado: nuevoEstado })
      .pipe(
        tap(() => this.listar()),
        catchError((err) => {
          this._error.set('Error al actualizar el estado del ticket.');
          return throwError(() => err);
        })
      );
  }

  eliminar(id: number): Observable<void> {
    this._error.set(null);
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.listar()),
      catchError((err) => {
        this._error.set('Error al eliminar el ticket de mantenimiento.');
        return throwError(() => err);
      })
    );
  }
}
