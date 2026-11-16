import { CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SesionService } from '../../../../core/services/sesion.service';
import { RutaCarpooling } from '../../models/ruta-carpooling.model';
import { CarpoolingService } from '../../services/carpooling.service';

@Component({
  selector: 'app-carpooling-list',
  standalone: true,
  imports: [RouterLink, FormsModule, CurrencyPipe, DatePipe, UpperCasePipe],
  templateUrl: './carpooling-list.component.html',
  styleUrl: './carpooling-list.component.css'
})
export class CarpoolingListComponent implements OnInit {
  readonly carpoolingService = inject(CarpoolingService);
  readonly sesionService = inject(SesionService);

  // Filtros reactivos con Signals
  terminoBusqueda = signal<string>('');
  turno = signal<string>('Todos');
  soloDisponibles = signal<boolean>(false);
  soloMisRutas = signal<boolean>(false);

  mensajeAlerta = signal<string | null>(null);

  // Lista filtrada reactiva (computed)
  readonly rutasFiltradas = computed(() => {
    const rutas = this.carpoolingService.rutas();
    const termino = this.terminoBusqueda().trim().toLowerCase();
    const turnoSeleccionado = this.turno();
    const filtroDisponibles = this.soloDisponibles();
    const filtroMisRutas = this.soloMisRutas();
    const usuario = this.sesionService.usuarioActivo();

    return rutas.filter((ruta) => {
      if (termino) {
        const coincide =
          ruta.origen.toLowerCase().includes(termino) ||
          ruta.destino.toLowerCase().includes(termino) ||
          ruta.puntosIntermedios.toLowerCase().includes(termino) ||
          ruta.autor.toLowerCase().includes(termino);
        if (!coincide) return false;
      }

      if (turnoSeleccionado !== 'Todos' && ruta.turno !== turnoSeleccionado) {
        return false;
      }

      if (filtroDisponibles && ruta.asientosDisponibles <= 0) {
        return false;
      }

      if (filtroMisRutas && ruta.autor !== usuario && !ruta.pasajeros.includes(usuario)) {
        return false;
      }

      return true;
    });
  });

  // KPIs
  readonly totalRutasActivas = computed(() =>
    this.carpoolingService.rutas().filter((r) => r.estado === 'Activa').length
  );

  readonly totalAsientosLibres = computed(() =>
    this.carpoolingService
      .rutas()
      .filter((r) => r.estado === 'Activa')
      .reduce((acc, r) => acc + r.asientosDisponibles, 0)
  );

  readonly misViajes = computed(() => {
    const usuario = this.sesionService.usuarioActivo();
    return this.carpoolingService
      .rutas()
      .filter((r) => r.autor === usuario || r.pasajeros.includes(usuario)).length;
  });

  ngOnInit(): void {
    this.carpoolingService.listar();
  }

  // Helpers para la tarjeta (card)
  esAutor(ruta: RutaCarpooling): boolean {
    return ruta.autor === this.sesionService.usuarioActivo();
  }

  yaEstaInscrito(ruta: RutaCarpooling): boolean {
    return ruta.pasajeros.includes(this.sesionService.usuarioActivo());
  }

  puedeReservar(ruta: RutaCarpooling): boolean {
    return (
      !this.esAutor(ruta) &&
      !this.yaEstaInscrito(ruta) &&
      ruta.asientosDisponibles > 0 &&
      ruta.estado === 'Activa'
    );
  }

  limpiarFiltros(): void {
    this.terminoBusqueda.set('');
    this.turno.set('Todos');
    this.soloDisponibles.set(false);
    this.soloMisRutas.set(false);
  }

  onReservarAsiento(ruta: RutaCarpooling): void {
    const pasajero = this.sesionService.usuarioActivo();
    this.carpoolingService.reservarAsiento(ruta, pasajero).subscribe({
      next: () => {
        this.mostrarAlerta(`Asiento reservado en la ruta "${ruta.origen} → ${ruta.destino}".`);
      }
    });
  }

  onCancelarAsiento(ruta: RutaCarpooling): void {
    const pasajero = this.sesionService.usuarioActivo();
    this.carpoolingService.cancelarReservaAsiento(ruta, pasajero).subscribe({
      next: () => {
        this.mostrarAlerta(`Se canceló tu reserva en la ruta "${ruta.origen} → ${ruta.destino}".`);
      }
    });
  }

  onEliminarRuta(id?: number): void {
    if (id === undefined) return;
    this.carpoolingService.eliminar(id).subscribe({
      next: () => {
        this.mostrarAlerta('Ruta eliminada correctamente.');
      }
    });
  }

  cerrarAlerta(): void {
    this.mensajeAlerta.set(null);
  }

  private mostrarAlerta(texto: string): void {
    this.mensajeAlerta.set(texto);
    setTimeout(() => {
      if (this.mensajeAlerta() === texto) {
        this.mensajeAlerta.set(null);
      }
    }, 4000);
  }
}
