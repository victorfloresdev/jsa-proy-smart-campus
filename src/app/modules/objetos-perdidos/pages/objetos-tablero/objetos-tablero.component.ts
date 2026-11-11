import { Component, inject } from '@angular/core';
import { SesionService } from '../../../../core/services/sesion.service';

@Component({
  selector: 'app-objetos-tablero',
  standalone: true,
  template: `
    <div class="card shadow-sm border-0">
      <div class="card-body p-4">
        <div class="d-flex align-items-center gap-2 mb-2">
          <i class="bi bi-search fs-3 text-primary"></i>
          <h2 class="h4 mb-0">Módulo 3: Directorio de Objetos Perdidos</h2>
        </div>
        <p class="text-muted mb-3">
          Módulo base listo para implementar en la rama <code>feat/objetos</code>.
        </p>
        <ul class="list-group list-group-flush small">
          <li class="list-group-item px-0"><strong>Ruta:</strong> <code>/objetos-perdidos</code></li>
          <li class="list-group-item px-0"><strong>Endpoint:</strong> <code>http://localhost:3000/objetos</code></li>
          <li class="list-group-item px-0"><strong>Carpeta:</strong> <code>src/app/modules/objetos-perdidos/</code></li>
          <li class="list-group-item px-0"><strong>Sesión activa:</strong> {{ sesionService.usuarioActivo() }}</li>
        </ul>
      </div>
    </div>
  `
})
export class ObjetosTableroComponent {
  readonly sesionService = inject(SesionService);
}
