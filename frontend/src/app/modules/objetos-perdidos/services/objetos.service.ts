import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { ObjetoPerdido } from '../models/objeto-perdido.model';

@Injectable({
  providedIn: 'root',
})
export class ObjetosService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/objetos';

  private readonly _objetos = signal<ObjetoPerdido[]>([]);
  private readonly _cargando = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly objetos = this._objetos.asReadonly();
  readonly cargando = this._cargando.asReadonly();
  readonly error = this._error.asReadonly();

  listar(): void {
    this._cargando.set(true);
    this._error.set(null);

    this.http.get<ObjetoPerdido[]>(this.apiUrl).subscribe({
      next: (datos) => {
        this._objetos.set(datos);
        this._cargando.set(false);
      },
      error: () => {
        this._error.set('No se pudo cargar el directorio de objetos perdidos.');
        this._cargando.set(false);
      },
    });
  }

  publicar(nuevoObjeto: Omit<ObjetoPerdido, 'id'>): Observable<ObjetoPerdido> {
    this._error.set(null);
    return this.http.post<ObjetoPerdido>(this.apiUrl, nuevoObjeto).pipe(
      tap(() => this.listar()),
      catchError((err) => {
        this._error.set('Error al publicar el objeto.');
        return throwError(() => err);
      })
    );
  }

  marcarRecuperado(id: number): Observable<ObjetoPerdido> {
    this._error.set(null);
    return this.http
      .patch<ObjetoPerdido>(`${this.apiUrl}/${id}`, { estado: 'Recuperado' })
      .pipe(
        tap(() => this.listar()),
        catchError((err) => {
          this._error.set('Error al actualizar el estado del objeto.');
          return throwError(() => err);
        })
      );
  }

  eliminar(id: number): Observable<void> {
    this._error.set(null);
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.listar()),
      catchError((err) => {
        this._error.set('Error al eliminar la publicación.');
        return throwError(() => err);
      })
    );
  }
}
