import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SesionService } from '../../../../core/services/sesion.service';
import { FiltroRutasComponent } from '../../components/filtro-rutas/filtro-rutas.component';
import { RutaCardComponent } from '../../components/ruta-card/ruta-card.component';
import { FiltroCarpooling, RutaCarpooling } from '../../models/ruta-carpooling.model';
import { CarpoolingService } from '../../services/carpooling.service';

@Component({
  selector: 'app-carpooling-list',
  standalone: true,
  imports: [RouterLink, FiltroRutasComponent, RutaCardComponent],
  templateUrl: './carpooling-list.component.html',
  styleUrl: './carpooling-list.component.css'
})
export class CarpoolingListComponent implements OnInit {
  readonly carpoolingService = inject(CarpoolingService);
  readonly sesionService = inject(SesionService);

  filtroActual = signal<FiltroCarpooling>({
    terminoBusqueda: '',
    turno: 'Todos',
    soloDisponibles: false,
    soloMisRutas: false
  });

  mensajeAlerta = signal<string | null>(null);

  readonly rutasFiltradas = computed(() => {
    const rutas = this.carpoolingService.rutas();
    const filtro = this.filtroActual();
    const usuario = this.sesionService.usuarioActivo();
    const termino = filtro.terminoBusqueda.trim().toLowerCase();

    return rutas.filter((ruta) => {
      if (termino) {
        const coincideTexto =
          ruta.origen.toLowerCase().includes(termino) ||
          ruta.destino.toLowerCase().includes(termino) ||
          ruta.puntosIntermedios.toLowerCase().includes(termino) ||
          ruta.autor.toLowerCase().includes(termino);
        if (!coincideTexto) {
          return false;
        }
      }

      if (filtro.turno !== 'Todos' && ruta.turno !== filtro.turno) {
        return false;
      }

      if (filtro.soloDisponibles && ruta.asientosDisponibles <= 0) {
        return false;
      }

      if (
        filtro.soloMisRutas &&
        ruta.autor !== usuario &&
        !ruta.pasajeros.includes(usuario)
      ) {
        return false;
      }

      return true;
    });
  });

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

  actualizarFiltro(nuevoFiltro: FiltroCarpooling): void {
    this.filtroActual.set(nuevoFiltro);
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

  onEliminarRuta(id: number): void {
    this.carpoolingService.eliminar(id).subscribe({
      next: () => {
        this.mostrarAlerta('Ruta eliminada correctamente del directorio.');
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
