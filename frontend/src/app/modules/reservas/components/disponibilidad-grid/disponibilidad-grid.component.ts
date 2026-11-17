import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Reserva, ESPACIOS_CAMPUS, BLOQUES_HORARIOS } from '../../models/reserva.model';
import { SesionService } from '../../../../core/services/sesion.service';

@Component({
  selector: 'app-disponibilidad-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './disponibilidad-grid.component.html'
})
export class DisponibilidadGridComponent {
  readonly sesionService = inject(SesionService);

  @Input({ required: true }) reservas: Reserva[] = [];
  @Input({ required: true }) fechaSeleccionada: string = '';
  @Output() reservarBloque = new EventEmitter<{ espacio: string; tipoEspacio: string; bloque: string }>();

  readonly espacios = ESPACIOS_CAMPUS;
  readonly bloques = BLOQUES_HORARIOS;


  esFechaPasada(): boolean {
    if (!this.fechaSeleccionada) return false;
    const hoyStr = new Date().toISOString().split('T')[0];
    return this.fechaSeleccionada < hoyStr;
  }

  obtenerReserva(espacio: string, bloque: string): Reserva | undefined {
    return this.reservas.find(
      (r) => r.espacio === espacio && r.bloqueHorario === bloque && r.fecha === this.fechaSeleccionada
    );
  }

  usuarioTieneReservaEnBloque(bloque: string): boolean {
    const usuario = this.sesionService.usuarioActivo();
    return this.reservas.some(
      (r) => r.autor === usuario && r.fecha === this.fechaSeleccionada && r.bloqueHorario === bloque
    );
  }

  onSeleccionar(espacio: string, tipoEspacio: string, bloque: string): void {
    if (!this.esFechaPasada() && !this.obtenerReserva(espacio, bloque) && !this.usuarioTieneReservaEnBloque(bloque)) {
      this.reservarBloque.emit({ espacio, tipoEspacio, bloque });
    }
  }
}