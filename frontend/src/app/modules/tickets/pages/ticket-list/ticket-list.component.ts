import { Component, inject } from '@angular/core';
import { SesionService } from '../../../../core/services/sesion.service';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  template: `
    <div class="card shadow-sm border-0">
      <div class="card-body p-4">
        <div class="d-flex align-items-center gap-2 mb-2">
          <i class="bi bi-tools fs-3 text-primary"></i>
          <h2 class="h4 mb-0">Módulo 2: Tickets de Mantenimiento</h2>
        </div>
        <p class="text-muted mb-3">
          Módulo base listo para implementar en la rama <code>feat/tickets</code>.
        </p>
        <ul class="list-group list-group-flush small">
          <li class="list-group-item px-0"><strong>Ruta:</strong> <code>/tickets</code></li>
          <li class="list-group-item px-0"><strong>Endpoint:</strong> <code>http://localhost:3000/tickets</code></li>
          <li class="list-group-item px-0"><strong>Carpeta:</strong> <code>src/app/modules/tickets/</code></li>
          <li class="list-group-item px-0"><strong>Sesión activa:</strong> {{ sesionService.usuarioActivo() }}</li>
        </ul>
      </div>
    </div>
  `
})
export class TicketListComponent {
  readonly sesionService = inject(SesionService);
}
