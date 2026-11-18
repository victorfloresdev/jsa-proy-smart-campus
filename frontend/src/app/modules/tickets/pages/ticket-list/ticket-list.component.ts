import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../services/ticket.service';
import { SesionService } from '../../../../core/services/sesion.service';
import { TicketItemComponent } from '../../components/ticket-item/ticket-item.component';
import { Ticket, EstadoTicket, PrioridadTicket } from '../../models/ticket.model';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, TicketItemComponent],
  templateUrl: './ticket-list.component.html',
})
export class TicketListComponent implements OnInit {
  readonly ticketService = inject(TicketService);
  readonly sesionService = inject(SesionService);

  // Filtros reactivos con Signals
  readonly filtroEstado = signal<string>('Todos');
  readonly filtroPrioridad = signal<string>('Todas');
  readonly terminoBusqueda = signal<string>('');
  readonly soloMisTickets = signal<boolean>(false);

  // KPIs obligatorios computados en vivo con computed()
  readonly ticketsPendientes = computed(() =>
    this.ticketService.tickets().filter((t) => t.estado === 'Pendiente').length
  );

  readonly ticketsEnRevision = computed(() =>
    this.ticketService.tickets().filter((t) => t.estado === 'En Revisión').length
  );

  readonly ticketsResueltos = computed(() =>
    this.ticketService.tickets().filter((t) => t.estado === 'Resuelto').length
  );

  readonly totalTickets = computed(() => this.ticketService.tickets().length);

  // Listado filtrado reactivo
  readonly ticketsFiltrados = computed(() => {
    const lista = this.ticketService.tickets();
    const estado = this.filtroEstado();
    const prioridad = this.filtroPrioridad();
    const termino = this.terminoBusqueda().trim().toLowerCase();
    const misTickets = this.soloMisTickets();
    const usuarioActivo = this.sesionService.usuarioActivo();

    return lista.filter((t) => {
      // Filtro por estado
      if (estado !== 'Todos' && t.estado !== estado) {
        return false;
      }

      // Filtro por prioridad
      if (prioridad !== 'Todas' && t.prioridad !== prioridad) {
        return false;
      }

      // Filtro por mis tickets
      if (misTickets && t.autor !== usuarioActivo) {
        return false;
      }

      // Filtro por término de búsqueda
      if (termino.length > 0) {
        const enTitulo = t.titulo.toLowerCase().includes(termino);
        const enAmbiente = t.ambiente.toLowerCase().includes(termino);
        const enPabellon = t.pabellon.toLowerCase().includes(termino);
        const enDescripcion = t.descripcion.toLowerCase().includes(termino);
        const enAutor = t.autor.toLowerCase().includes(termino);

        if (!enTitulo && !enAmbiente && !enPabellon && !enDescripcion && !enAutor) {
          return false;
        }
      }

      return true;
    });
  });

  ngOnInit(): void {
    this.ticketService.listar();
  }

  setFiltroEstado(estado: string): void {
    this.filtroEstado.set(estado);
  }

  setFiltroPrioridad(prioridad: string): void {
    this.filtroPrioridad.set(prioridad);
  }

  onActualizarEstado(id: number, nuevoEstado: EstadoTicket): void {
    this.ticketService.actualizarEstado(id, nuevoEstado).subscribe();
  }

  onEliminarTicket(id: number): void {
    this.ticketService.eliminar(id).subscribe();
  }

  limpiarFiltros(): void {
    this.filtroEstado.set('Todos');
    this.filtroPrioridad.set('Todas');
    this.terminoBusqueda.set('');
    this.soloMisTickets.set(false);
  }
}
