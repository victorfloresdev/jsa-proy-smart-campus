import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SesionService {
  private readonly STORAGE_KEY = 'smartcampus_usuario_activo';

  readonly perfilesDisponibles: string[] = [
    'Ana García (Ing. Sistemas)',
    'Luis Mendoza (Arquitectura)',
    'Carlos Rojas (Administración)',
    'Elena Vargas (Derecho)',
    'Mg. Anthony Távara (Docente)'
  ];

  private _usuarioActivo = signal<string>(this.obtenerUsuarioInicial());
  readonly usuarioActivo = this._usuarioActivo.asReadonly();

  private obtenerUsuarioInicial(): string {
    const guardado = localStorage.getItem(this.STORAGE_KEY);
    if (guardado && guardado.trim().length > 0 && this.perfilesDisponibles.includes(guardado)) {
      return guardado;
    }
    const porDefecto = this.perfilesDisponibles[0];
    localStorage.setItem(this.STORAGE_KEY, porDefecto);
    return porDefecto;
  }

  cambiarUsuario(nuevoNombre: string): void {
    const limpio = nuevoNombre?.trim();
    if (!limpio) {
      return;
    }
    this._usuarioActivo.set(limpio);
    localStorage.setItem(this.STORAGE_KEY, limpio);
  }
}
