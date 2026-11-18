import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SesionService } from '../../../../core/services/sesion.service';
import { RutaCarpooling } from '../../models/ruta-carpooling.model';
import { CarpoolingService } from '../../services/carpooling.service';

@Component({
  selector: 'app-carpooling-list',
  standalone: true,
  imports: [RouterLink, FormsModule, CurrencyPipe],
  templateUrl: './carpooling-list.component.html',
  styleUrl: './carpooling-list.component.css'
})
export class CarpoolingListComponent implements OnInit {
  readonly carpoolingService = inject(CarpoolingService);
  readonly sesionService = inject(SesionService);

  // Filtro de búsqueda reactivo
  busqueda = signal('');
  alerta = signal<string | null>(null);
  errorAlerta = signal<string | null>(null);

  // Solo rutas con fecha y hora posterior al momento actual
  readonly rutasVigentes = computed(() => {
    const ahora = new Date();
    return this.carpoolingService.rutas().filter((r) => {
      const fechaRuta = new Date(`${r.fecha}T${r.hora}:00`);
      return !isNaN(fechaRuta.getTime()) && fechaRuta >= ahora;
    });
  });

  // Lista filtrada con computed (parte solo desde rutasVigentes)
  readonly rutasFiltradas = computed(() => {
    const texto = this.busqueda().trim().toLowerCase();
    const lista = this.rutasVigentes();

    if (!texto) return lista;

    return lista.filter((r) =>
      r.origen.toLowerCase().includes(texto) ||
      r.destino.toLowerCase().includes(texto) ||
      r.conductor.toLowerCase().includes(texto) ||
      r.vehiculo.toLowerCase().includes(texto) ||
      (r.paradas || []).some((p) => p.lugar.toLowerCase().includes(texto))
    );
  });

  // Métricas rápidas (KPIs solo de rutas vigentes)
  readonly totalRutas = computed(() => this.rutasVigentes().length);
  readonly totalCupos = computed(() =>
    this.rutasVigentes().reduce((total, r) => total + (r.cupos || 0), 0)
  );

  ngOnInit(): void {
    this.carpoolingService.cargar();
  }

  esConductor(ruta: RutaCarpooling): boolean {
    return ruta.conductor === this.sesionService.usuarioActivo();
  }

  yaReservo(ruta: RutaCarpooling): boolean {
    return (ruta.pasajeros || []).includes(this.sesionService.usuarioActivo());
  }

  reservar(id?: number): void {
    if (id === undefined) return;
    const pasajero = this.sesionService.usuarioActivo();
    this.carpoolingService.reservar(id, pasajero).subscribe({
      next: () => this.mostrarAlerta('¡Asiento reservado con éxito! Se descontó 1 cupo.'),
      error: (err) => this.mostrarError(err?.error?.mensaje || 'No se pudo realizar la reserva.')
    });
  }

  eliminar(id?: number): void {
    if (id === undefined) return;
    if (confirm('¿Estás seguro de que deseas eliminar esta ruta?')) {
      this.carpoolingService.eliminar(id).subscribe({
        next: () => this.mostrarAlerta('Ruta eliminada correctamente.')
      });
    }
  }

  cerrarAlerta(): void {
    this.alerta.set(null);
  }

  cerrarError(): void {
    this.errorAlerta.set(null);
  }

  private mostrarAlerta(msg: string): void {
    this.errorAlerta.set(null);
    this.alerta.set(msg);
    setTimeout(() => {
      if (this.alerta() === msg) {
        this.alerta.set(null);
      }
    }, 4000);
  }

  private mostrarError(msg: string): void {
    this.alerta.set(null);
    this.errorAlerta.set(msg);
    setTimeout(() => {
      if (this.errorAlerta() === msg) {
        this.errorAlerta.set(null);
      }
    }, 4000);
  }
}
