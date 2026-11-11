import { CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RutaCarpooling } from '../../models/ruta-carpooling.model';

@Component({
  selector: 'app-ruta-card',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, UpperCasePipe, RouterLink],
  templateUrl: './ruta-card.component.html',
  styleUrl: './ruta-card.component.css'
})
export class RutaCardComponent {
  @Input({ required: true }) ruta!: RutaCarpooling;
  @Input({ required: true }) usuarioActivo!: string;

  @Output() reservar = new EventEmitter<RutaCarpooling>();
  @Output() cancelarAsiento = new EventEmitter<RutaCarpooling>();
  @Output() eliminar = new EventEmitter<number>();

  esAutor(): boolean {
    return this.ruta.autor === this.usuarioActivo;
  }

  yaEstaInscrito(): boolean {
    return this.ruta.pasajeros.includes(this.usuarioActivo);
  }

  puedeReservar(): boolean {
    return (
      !this.esAutor() &&
      !this.yaEstaInscrito() &&
      this.ruta.asientosDisponibles > 0 &&
      this.ruta.estado === 'Activa'
    );
  }
}
