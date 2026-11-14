import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { EstadoRuta, RutaCarpooling } from '../models/ruta-carpooling.model';

@Injectable({
  providedIn: 'root'
})
export class CarpoolingService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/rutas';

  private _rutas = signal<RutaCarpooling[]>([]);
  private _cargando = signal<boolean>(false);
  private _error = signal<string | null>(null);

  readonly rutas = this._rutas.asReadonly();
  readonly cargando = this._cargando.asReadonly();
  readonly error = this._error.asReadonly();

  listar(): void {
    this._cargando.set(true);
    this._error.set(null);

    this.http.get<RutaCarpooling[]>(this.apiUrl).subscribe({
      next: (data) => {
        this._rutas.set(data);
        this._cargando.set(false);
      },
      error: () => {
        this._error.set('No se pudieron cargar las rutas. Verifica que el servidor backend esté activo en el puerto 3000.');
        this._cargando.set(false);
      }
    });
  }

  obtenerPorId(id: number): Observable<RutaCarpooling> {
    return this.http.get<RutaCarpooling>(`${this.apiUrl}/${id}`);
  }

  crear(nuevaRuta: Omit<RutaCarpooling, 'id'>): Observable<RutaCarpooling> {
    return this.http.post<RutaCarpooling>(this.apiUrl, nuevaRuta).pipe(
      tap(() => this.listar())
    );
  }

  actualizar(id: number, ruta: RutaCarpooling): Observable<RutaCarpooling> {
    return this.http.put<RutaCarpooling>(`${this.apiUrl}/${id}`, ruta).pipe(
      tap(() => this.listar())
    );
  }

  reservarAsiento(ruta: RutaCarpooling, nombrePasajero: string): Observable<RutaCarpooling> {
    const nuevosAsientos = Math.max(0, ruta.asientosDisponibles - 1);
    const nuevosPasajeros = [...ruta.pasajeros, nombrePasajero];
    const nuevoEstado: EstadoRuta = nuevosAsientos === 0 ? 'Completa' : 'Activa';

    return this.http
      .patch<RutaCarpooling>(`${this.apiUrl}/${ruta.id}`, {
        asientosDisponibles: nuevosAsientos,
        pasajeros: nuevosPasajeros,
        estado: nuevoEstado
      })
      .pipe(tap(() => this.listar()));
  }

  cancelarReservaAsiento(ruta: RutaCarpooling, nombrePasajero: string): Observable<RutaCarpooling> {
    const nuevosPasajeros = ruta.pasajeros.filter((p) => p !== nombrePasajero);
    const nuevosAsientos = Math.min(ruta.asientosTotales, ruta.asientosDisponibles + 1);

    return this.http
      .patch<RutaCarpooling>(`${this.apiUrl}/${ruta.id}`, {
        asientosDisponibles: nuevosAsientos,
        pasajeros: nuevosPasajeros,
        estado: 'Activa' as EstadoRuta
      })
      .pipe(tap(() => this.listar()));
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.listar())
    );
  }
}
