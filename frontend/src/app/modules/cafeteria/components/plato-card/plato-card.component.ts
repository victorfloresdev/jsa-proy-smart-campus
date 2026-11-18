import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import {
  CurrencyPipe,
  UpperCasePipe
} from '@angular/common';

import { PlatoMenu } from '../../models/pedido.model';

@Component({
  selector: 'app-plato-card',
  standalone: true,
  imports: [CurrencyPipe, UpperCasePipe],
  templateUrl: './plato-card.component.html',
  styleUrl: './plato-card.component.css'
})
export class PlatoCardComponent {

  @Input({ required: true })
  plato!: PlatoMenu;

  @Output()
  seleccionarPlato = new EventEmitter<PlatoMenu>();

}