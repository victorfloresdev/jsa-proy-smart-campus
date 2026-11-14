import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReservaService } from '../../services/reserva.service';
import { SesionService } from '../../../../core/services/sesion.service';
import { DisponibilidadGridComponent } from '../../components/disponibilidad-grid/disponibilidad-grid.component';

@Component({
  selector: 'app-reservas-vista',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, DisponibilidadGridComponent],
  templateUrl: './reservas-vista.component.html'
})
export class ReservasVistaComponent {
  readonly reservaService = inject(ReservaService);
  readonly sesionService = inject(SesionService);
  private readonly router = inject(Router);

  readonly fechaFiltro = signal<string>(new Date().toISOString().split('T')[0]);

  readonly reservasFiltradas = computed(() => {
    const fecha = this.fechaFiltro();
    return this.reservaService.reservas().filter((r) => r.fecha === fecha);
  });

  onBloqueSeleccionado(evento: { espacio: string; tipoEspacio: string; bloque: string }): void {
    this.router.navigate(['/reservas/nueva'], {
      queryParams: {
        espacio: evento.espacio,
        tipoEspacio: evento.tipoEspacio,
        fecha: this.fechaFiltro(),
        bloque: evento.bloque
      }
    });
  }

  cancelarReserva(id?: number): void {
    if (id && confirm('¿Deseas cancelar esta reserva?')) {
      this.reservaService.cancelar(id).subscribe();
    }
  }
}