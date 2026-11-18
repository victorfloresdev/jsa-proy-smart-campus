import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ReservaService } from '../../services/reserva.service';
import { SesionService } from '../../../../core/services/sesion.service';
import { ESPACIOS_CAMPUS, BLOQUES_HORARIOS } from '../../models/reserva.model';

@Component({
  selector: 'app-reserva-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reserva-form.component.html'
})
export class ReservaFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly reservaService = inject(ReservaService);
  readonly sesionService = inject(SesionService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly espacios = ESPACIOS_CAMPUS;
  readonly bloques = BLOQUES_HORARIOS;
  readonly fechaMinima = new Date().toISOString().split('T')[0];

  reservaForm!: FormGroup;
  mensajeError: string | null = null;
  guardando = false;

  ngOnInit(): void {
    const query = this.route.snapshot.queryParams;

    this.reservaForm = this.fb.group({
      espacio: [query['espacio'] || '', [Validators.required]],
      tipoEspacio: [query['tipoEspacio'] || '', [Validators.required]],
      fecha: [query['fecha'] || this.fechaMinima, [Validators.required]],
      bloqueHorario: [query['bloque'] || '', [Validators.required]],
      cantidadPersonas: [2, [Validators.required, Validators.min(2), Validators.max(10)]],
      motivo: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  onEspacioChange(): void {
    const espSeleccionado = this.reservaForm.get('espacio')?.value;
    const encontrado = this.espacios.find((e) => e.nombre === espSeleccionado);
    if (encontrado) {
      this.reservaForm.patchValue({ tipoEspacio: encontrado.tipo });
    }
  }

  guardar(): void {
    if (this.reservaForm.invalid) {
      this.reservaForm.markAllAsTouched();
      return;
    }

    const val = this.reservaForm.value;
    const usuarioActivo = this.sesionService.usuarioActivo();

    if (val.fecha < this.fechaMinima) {
      this.mensajeError = 'No puedes realizar reservas para fechas pasadas.';
      return;
    }

    const conflictoEspacio = this.reservaService.reservas().some(
      (r) => r.espacio === val.espacio && r.fecha === val.fecha && r.bloqueHorario === val.bloqueHorario
    );

    if (conflictoEspacio) {
      this.mensajeError = 'El espacio seleccionado ya se encuentra reservado en esta fecha y horario.';
      return;
    }

    const conflictoUsuario = this.reservaService.reservas().some(
      (r) => r.autor === usuarioActivo && r.fecha === val.fecha && r.bloqueHorario === val.bloqueHorario
    );

    if (conflictoUsuario) {
      this.mensajeError = 'Ya tienes una reserva registrada en este mismo bloque horario. No puedes estar en dos lugares a la vez.';
      return;
    }

    this.guardando = true;
    this.mensajeError = null;

    const nuevaReserva = {
      ...val,
      estado: 'Confirmada' as const,
      autor: usuarioActivo
    };

    this.reservaService.crear(nuevaReserva).subscribe({
      next: () => {
        this.guardando = false;
        this.router.navigate(['/reservas']);
      },
      error: () => {
        this.mensajeError = 'Ocurrió un error al procesar la reserva.';
        this.guardando = false;
      }
    });
  }
}