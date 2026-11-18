import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CafeteriaService } from '../../services/cafeteria.service';
import { PlatoMenu } from '../../models/pedido.model';
import { SesionService } from '../../../../core/services/sesion.service';

@Component({
  selector: 'app-pedido-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pedido-form.component.html',
  styleUrl: './pedido-form.component.css'
})
export class PedidoFormComponent implements OnInit {

  platoSeleccionado: PlatoMenu | undefined;

  readonly form: FormGroup;

  guardando = false;

  // Calcula el total según el plato y la cantidad actuales
  get total(): number {
    const cantidad = Number(
      this.form.controls['cantidad'].value ?? 0
    );

    return (this.platoSeleccionado?.precio ?? 0) * cantidad;
  }

  constructor(
    private fb: FormBuilder,
    public cafeteria: CafeteriaService,
    public sesionService: SesionService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      plato: ['', Validators.required],
      cantidad: [
        1,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(5)
        ]
      ],
      observaciones: ['']
    });
  }

  ngOnInit(): void {
    const nombrePlato = this.route.snapshot.queryParamMap.get('plato');

    if (nombrePlato) {
      this.seleccionarPlato(nombrePlato);
    }

    this.form.controls['plato'].valueChanges.subscribe(nombre => {
      this.platoSeleccionado = this.cafeteria.menuDelDia.find(
        plato => plato.plato === nombre
      );
    });
  }

  seleccionarPlato(nombre: string): void {
    const plato = this.cafeteria.menuDelDia.find(
      item => item.plato === nombre
    );

    if (plato) {
      this.platoSeleccionado = plato;
      this.form.controls['plato'].setValue(plato.plato);
    }
  }

  guardarPedido(): void {
    if (
      this.form.invalid ||
      !this.platoSeleccionado ||
      this.guardando
    ) {
      this.form.markAllAsTouched();
      return;
    }

    const cantidad = Number(
      this.form.controls['cantidad'].value
    );

    const nuevoPedido = {
      plato: this.platoSeleccionado.plato,
      categoria: this.platoSeleccionado.categoria,
      precio: this.platoSeleccionado.precio,
      cantidad,
      total: this.total,
      fecha: new Date().toISOString(),
      estado: 'En preparación' as const,
      autor: this.sesionService.usuarioActivo()
    };

    this.guardando = true;

    this.cafeteria.crear(nuevoPedido).subscribe({
      next: () => {
        this.router.navigate(['/cafeteria']);
      },
      error: () => {
        this.guardando = false;
        alert(
          'No se pudo registrar el pedido. Verifica que el servidor esté activo.'
        );
      }
    });
  }

  volver(): void {
    this.router.navigate(['/cafeteria']);
  }
}