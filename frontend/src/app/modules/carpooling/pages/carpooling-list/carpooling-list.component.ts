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

  // Lista filtrada con computed
  readonly rutasFiltradas = computed(() => {
    const texto = this.busqueda().trim().toLowerCase();
    const lista = this.carpoolingService.rutas();

    if (!texto) return lista;

    return lista.filter((r) =>
      r.origen.toLowerCase().includes(texto) ||
      r.destino.toLowerCase().includes(texto) ||
      r.conductor.toLowerCase().includes(texto) ||
      r.vehiculo.toLowerCase().includes(texto)
    );
  });

  // Métricas rápidas (KPIs)
  readonly totalRutas = computed(() => this.carpoolingService.rutas().length);
  readonly totalCupos = computed(() =>
    this.carpoolingService.rutas().reduce((total, r) => total + (r.cupos || 0), 0)
  );

  ngOnInit(): void {
    this.carpoolingService.cargar();
  }

  esConductor(ruta: RutaCarpooling): boolean {
    return ruta.conductor === this.sesionService.usuarioActivo();
  }

  reservar(id?: number): void {
    if (id === undefined) return;
    this.carpoolingService.reservar(id).subscribe({
      next: () => this.mostrarAlerta('¡Asiento reservado con éxito! Se descontó 1 cupo.')
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

  private mostrarAlerta(msg: string): void {
    this.alerta.set(msg);
    setTimeout(() => {
      if (this.alerta() === msg) {
        this.alerta.set(null);
      }
    }, 4000);
  }
}
