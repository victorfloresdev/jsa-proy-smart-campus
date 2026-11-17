import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { ObjetoPerdido } from '../../models/objeto-perdido.model';

@Component({
  selector: 'app-objeto-card',
  standalone: true,
  imports: [DatePipe, TitleCasePipe],
  templateUrl: './objeto-card.component.html',
})
export class ObjetoCardComponent {
  @Input({ required: true }) objeto!: ObjetoPerdido;
  @Input({ required: true }) usuarioActivo!: string;

  @Output() marcarRecuperado = new EventEmitter<number>();
  @Output() eliminar = new EventEmitter<number>();

  readonly imagenPorDefecto =
    'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?w=400';

  get esPropietario(): boolean {
    return this.objeto.autor === this.usuarioActivo;
  }

  onErrorImagen(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img.src !== this.imagenPorDefecto) {
      img.src = this.imagenPorDefecto;
    }
  }

  onMarcarRecuperado(): void {
    if (this.objeto.id !== undefined) {
      this.marcarRecuperado.emit(this.objeto.id);
    }
  }

  onEliminar(): void {
    if (this.objeto.id !== undefined) {
      this.eliminar.emit(this.objeto.id);
    }
  }
}