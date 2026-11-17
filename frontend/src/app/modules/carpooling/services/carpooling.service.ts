import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { RutaCarpooling } from '../models/ruta-carpooling.model';

@Injectable({
  providedIn: 'root'
})
export class CarpoolingService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/rutas';

  private _rutas = signal<RutaCarpooling[]>([]);
  readonly rutas = this._rutas.asReadonly();

  cargar(): void {
    this.http.get<RutaCarpooling[]>(this.apiUrl)
      .subscribe((data) => this._rutas.set(data));
  }

  obtener(id: number): Observable<RutaCarpooling> {
    return this.http.get<RutaCarpooling>(`${this.apiUrl}/${id}`);
  }

  agregar(ruta: Omit<RutaCarpooling, 'id'>): Observable<RutaCarpooling> {
    return this.http.post<RutaCarpooling>(this.apiUrl, ruta).pipe(
      tap(() => this.cargar())
    );
  }

  modificar(id: number, ruta: RutaCarpooling): Observable<RutaCarpooling> {
    return this.http.put<RutaCarpooling>(`${this.apiUrl}/${id}`, ruta).pipe(
      tap(() => this.cargar())
    );
  }

  reservar(id: number): Observable<RutaCarpooling> {
    return this.http.patch<RutaCarpooling>(`${this.apiUrl}/${id}`, { reservar: true }).pipe(
      tap(() => this.cargar())
    );
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.cargar())
    );
  }
}
