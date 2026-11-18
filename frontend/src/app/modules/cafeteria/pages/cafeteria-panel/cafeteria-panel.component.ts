import { Component, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { CafeteriaService } from '../../services/cafeteria.service';
import { PlatoCardComponent } from '../../components/plato-card/plato-card.component';

@Component({
  selector: 'app-cafeteria-panel',
  standalone: true,
  imports: [
    CommonModule,
    PlatoCardComponent
  ],
  templateUrl: './cafeteria-panel.component.html',
  styleUrl: './cafeteria-panel.component.css'
})
export class CafeteriaPanelComponent implements OnInit {

  // Indicadores calculados automáticamente
  readonly pedidosTotales = computed(
    () => this.cafeteria.pedidos().length
  );

  readonly pedidosEnPreparacion = computed(
    () => this.cafeteria.pedidos().filter(
      pedido => pedido.estado === 'En preparación'
    ).length
  );

  readonly recaudacionTotal = computed(
    () => this.cafeteria.pedidos().reduce(
      (total, pedido) => total + pedido.total,
      0
    )
  );

  constructor(
    public cafeteria: CafeteriaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cafeteria.listar();
  }

  nuevoPedido(): void {
    this.router.navigate(['/cafeteria/nuevo-pedido']);
  }

  nuevoPedidoConPlato(nombre: string): void {
    this.router.navigate(['/cafeteria/nuevo-pedido'], {
      queryParams: { plato: nombre }
    });
  }

  marcarEntregado(id: number): void {
    this.cafeteria.marcarEntregado(id).subscribe();
  }

  eliminarPedido(id: number): void {
    if (confirm('¿Deseas cancelar este pedido?')) {
      this.cafeteria.eliminar(id).subscribe();
    }
  }
}