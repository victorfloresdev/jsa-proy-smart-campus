import { Component, inject } from '@angular/core';
import { SesionService } from '../../../../core/services/sesion.service';

@Component({
  selector: 'app-cafeteria-panel',
  standalone: true,
  template: `
    <div class="card shadow-sm border-0">
      <div class="card-body p-4">
        <div class="d-flex align-items-center gap-2 mb-2">
          <i class="bi bi-cup-hot fs-3 text-primary"></i>
          <h2 class="h4 mb-0">Módulo 1: Menú y Cafetería</h2>
        </div>
        <p class="text-muted mb-3">
          Módulo base listo para implementar en la rama <code>feat/cafeteria</code>.
        </p>
        <ul class="list-group list-group-flush small">
          <li class="list-group-item px-0"><strong>Ruta:</strong> <code>/cafeteria</code></li>
          <li class="list-group-item px-0"><strong>Endpoint:</strong> <code>http://localhost:3000/pedidos</code></li>
          <li class="list-group-item px-0"><strong>Carpeta:</strong> <code>src/app/modules/cafeteria/</code></li>
          <li class="list-group-item px-0"><strong>Sesión activa:</strong> {{ sesionService.usuarioActivo() }}</li>
        </ul>
      </div>
    </div>
  `
})
export class CafeteriaPanelComponent {
  readonly sesionService = inject(SesionService);
}
