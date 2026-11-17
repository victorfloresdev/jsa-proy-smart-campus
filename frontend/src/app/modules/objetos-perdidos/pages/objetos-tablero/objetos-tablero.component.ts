import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SesionService } from '../../../../core/services/sesion.service';
import { ObjetosService } from '../../services/objetos.service';
import { FiltroTipoObjeto } from '../../models/objeto-perdido.model';
import { ObjetoCardComponent } from '../../components/objeto-card/objeto-card.component';

@Component({
  selector: 'app-objetos-tablero',
  standalone: true,
  imports: [RouterLink, ObjetoCardComponent],
  templateUrl: './objetos-tablero.component.html',
})
export class ObjetosTableroComponent implements OnInit {
  readonly objetosService = inject(ObjetosService);
  readonly sesionService = inject(SesionService);

  readonly pestanaActiva = signal<FiltroTipoObjeto>('Todos');

  readonly objetosFiltrados = computed(() => {
    const lista = this.objetosService.objetos();
    const filtro = this.pestanaActiva();

    if (filtro === 'Todos') return lista;
    const tipoBuscado = filtro === 'Perdidos' ? 'Perdido' : 'Encontrado';
    return lista.filter((obj) => obj.tipo === tipoBuscado);
  });

  readonly totalActivos = computed(
    () => this.objetosService.objetos().filter((o) => o.estado === 'Activo').length
  );

  ngOnInit(): void {
    this.objetosService.listar();
  }

  cambiarPestana(pestana: FiltroTipoObjeto): void {
    this.pestanaActiva.set(pestana);
  }

  onMarcarRecuperado(id: number): void {
    this.objetosService.marcarRecuperado(id).subscribe();
  }

  onEliminar(id: number): void {
    if (confirm('¿Seguro que deseas eliminar esta publicación?')) {
      this.objetosService.eliminar(id).subscribe();
    }
  }
}