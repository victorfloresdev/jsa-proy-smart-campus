import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Ticket, EstadoTicket, PrioridadTicket } from '../../models/ticket.model';

@Component({
  selector: 'app-ticket-item',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './ticket-item.component.html',
})
export class TicketItemComponent {
  @Input({ required: true }) ticket!: Ticket;
  @Input() usuarioActivo: string = '';

  @Output() cambiarEstado = new EventEmitter<EstadoTicket>();
  @Output() eliminar = new EventEmitter<number>();

  get esAutor(): boolean {
    return this.ticket.autor === this.usuarioActivo;
  }

  get prioridadBadgeClass(): string {
    switch (this.ticket.prioridad) {
      case 'Alta':
        return 'bg-danger text-white';
      case 'Media':
        return 'bg-warning text-dark';
      case 'Baja':
        return 'bg-info text-dark';
      default:
        return 'bg-secondary text-white';
    }
  }

  get estadoBadgeClass(): string {
    switch (this.ticket.estado) {
      case 'Pendiente':
        return 'bg-secondary text-white';
      case 'En Revisión':
        return 'bg-primary text-white';
      case 'Resuelto':
        return 'bg-success text-white';
      default:
        return 'bg-secondary text-white';
    }
  }

  get estadoIconClass(): string {
    switch (this.ticket.estado) {
      case 'Pendiente':
        return 'bi-hourglass-split';
      case 'En Revisión':
        return 'bi-gear-wide-connected';
      case 'Resuelto':
        return 'bi-check-circle-fill';
      default:
        return 'bi-circle';
    }
  }

  onAvanzarCiclo(): void {
    if (this.ticket.estado === 'Pendiente') {
      this.cambiarEstado.emit('En Revisión');
    } else if (this.ticket.estado === 'En Revisión') {
      this.cambiarEstado.emit('Resuelto');
    }
  }

  onCambiarEstado(nuevoEstado: EstadoTicket): void {
    if (this.ticket.estado !== nuevoEstado) {
      this.cambiarEstado.emit(nuevoEstado);
    }
  }

  onEliminar(): void {
    if (this.ticket.id !== undefined) {
      if (confirm(`¿Estás seguro de eliminar la incidencia "${this.ticket.titulo}"?`)) {
        this.eliminar.emit(this.ticket.id);
      }
    }
  }
}
