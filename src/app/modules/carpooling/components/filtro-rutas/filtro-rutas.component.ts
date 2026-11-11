import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FiltroCarpooling } from '../../models/ruta-carpooling.model';

@Component({
  selector: 'app-filtro-rutas',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './filtro-rutas.component.html',
  styleUrl: './filtro-rutas.component.css'
})
export class FiltroRutasComponent {
  @Input() totalResultados: number = 0;
  @Output() filtroCambiado = new EventEmitter<FiltroCarpooling>();

  terminoBusqueda = '';
  turno = 'Todos';
  soloDisponibles = false;
  soloMisRutas = false;

  emitirFiltros(): void {
    this.filtroCambiado.emit({
      terminoBusqueda: this.terminoBusqueda,
      turno: this.turno,
      soloDisponibles: this.soloDisponibles,
      soloMisRutas: this.soloMisRutas
    });
  }

  limpiarFiltros(): void {
    this.terminoBusqueda = '';
    this.turno = 'Todos';
    this.soloDisponibles = false;
    this.soloMisRutas = false;
    this.emitirFiltros();
  }
}
