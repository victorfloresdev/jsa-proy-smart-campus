import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Reserva, ESPACIOS_CAMPUS, BLOQUES_HORARIOS } from '../../models/reserva.model';

@Component({
  selector: 'app-disponibilidad-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './disponibilidad-grid.component.html'
})
export class DisponibilidadGridComponent {
  @Input({ required: true }) reservas: Reserva[] = [];
  @Input({ required: true }) fechaSeleccionada: string = '';
  @Output() reservarBloque = new EventEmitter<{ espacio: string; tipoEspacio: string; bloque: string }>();

  readonly espacios = ESPACIOS_CAMPUS;
  readonly bloques = BLOQUES_HORARIOS;

  obtenerReserva(espacio: string, bloque: string): Reserva | undefined {
    return this.reservas.find(
      (r) => r.espacio === espacio && r.bloqueHorario === bloque && r.fecha === this.fechaSeleccionada
    );
  }

  onSeleccionar(espacio: string, tipoEspacio: string, bloque: string): void {
    if (!this.obtenerReserva(espacio, bloque)) {
      this.reservarBloque.emit({ espacio, tipoEspacio, bloque });
    }
  }
}