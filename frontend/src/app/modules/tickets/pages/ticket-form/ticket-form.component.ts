import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TicketService } from '../../services/ticket.service';
import { SesionService } from '../../../../core/services/sesion.service';
import { PrioridadTicket } from '../../models/ticket.model';

@Component({
  selector: 'app-ticket-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './ticket-form.component.html',
})
export class TicketFormComponent {
  private readonly fb = inject(FormBuilder);
  readonly ticketService = inject(TicketService);
  readonly sesionService = inject(SesionService);
  private readonly router = inject(Router);

  readonly prioridades: PrioridadTicket[] = ['Baja', 'Media', 'Alta'];
  readonly pabellones: string[] = [
    'Pabellón A',
    'Pabellón B',
    'Pabellón C',
    'Pabellón D',
    'Edificio Central',
    'Biblioteca Central',
    'Laboratorios de Ingeniería',
    'Áreas Deportivas',
  ];

  ticketForm: FormGroup = this.fb.group({
    titulo: ['', [Validators.required, Validators.minLength(5)]],
    ambiente: ['', [Validators.required]],
    pabellon: ['', [Validators.required]],
    prioridad: ['Media' as PrioridadTicket, [Validators.required]],
    descripcion: ['', [Validators.required, Validators.minLength(10)]],
  });

  guardando = false;
  mensajeError: string | null = null;

  campoInvalido(campo: string): boolean {
    const control = this.ticketForm.get(campo);
    return !!(control && control.invalid && control.touched);
  }

  guardar(): void {
    if (this.ticketForm.invalid) {
      this.ticketForm.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.mensajeError = null;

    const fechaHoy = new Date().toISOString().split('T')[0];
    const nuevoTicket = {
      titulo: this.ticketForm.value.titulo.trim(),
      ambiente: this.ticketForm.value.ambiente.trim(),
      pabellon: this.ticketForm.value.pabellon.trim(),
      prioridad: this.ticketForm.value.prioridad,
      descripcion: this.ticketForm.value.descripcion.trim(),
      estado: 'Pendiente' as const,
      fechaReporte: fechaHoy,
      autor: this.sesionService.usuarioActivo(),
    };

    this.ticketService.crear(nuevoTicket).subscribe({
      next: () => {
        this.guardando = false;
        this.router.navigate(['/tickets']);
      },
      error: (err) => {
        this.guardando = false;
        this.mensajeError =
          err?.error?.mensaje ||
          'Ocurrió un error al registrar el ticket. Verifica que el servidor backend esté en ejecución.';
      },
    });
  }
}
