import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SesionService } from '../../../../core/services/sesion.service';
import { EstadoRuta, RutaCarpooling } from '../../models/ruta-carpooling.model';
import { CarpoolingService } from '../../services/carpooling.service';

@Component({
  selector: 'app-carpooling-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './carpooling-form.component.html',
  styleUrl: './carpooling-form.component.css'
})
export class CarpoolingFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly carpoolingService = inject(CarpoolingService);
  readonly sesionService = inject(SesionService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  esEdicion = false;
  rutaId: number | null = null;
  enviado = false;
  guardando = false;
  errorCarga: string | null = null;

  private autorOriginal = '';
  private pasajerosActuales: string[] = [];

  private readonly fechaHoyISO = new Date().toISOString().split('T')[0];

  form: FormGroup = this.fb.group({
    origen: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
    destino: ['Campus UTP', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
    puntosIntermedios: ['', [Validators.required, Validators.minLength(5)]],
    fechaSalida: [this.fechaHoyISO, [Validators.required]],
    horaSalida: ['07:30', [Validators.required, Validators.pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)]],
    turno: ['Mañana', [Validators.required]],
    vehiculo: ['', [Validators.required, Validators.minLength(5)]],
    asientosTotales: [4, [Validators.required, Validators.min(1), Validators.max(6)]],
    asientosDisponibles: [4, [Validators.required, Validators.min(1), Validators.max(6)]],
    aporteSugerido: [5.0, [Validators.required, Validators.min(0), Validators.max(50)]],
    telefonoContacto: ['', [Validators.required, Validators.pattern(/^9\d{8}$/)]],
    observaciones: ['', [Validators.maxLength(250)]]
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.esEdicion = true;
      this.rutaId = Number(idParam);
      this.form
        .get('asientosDisponibles')
        ?.setValidators([Validators.required, Validators.min(0), Validators.max(6)]);
      this.form.get('asientosDisponibles')?.updateValueAndValidity();

      this.carpoolingService.obtenerPorId(this.rutaId).subscribe({
        next: (ruta) => {
          this.autorOriginal = ruta.autor;
          this.pasajerosActuales = ruta.pasajeros ?? [];
          this.form.patchValue(ruta);
        },
        error: () => {
          this.errorCarga = 'No se encontró la ruta solicitada para editar.';
        }
      });
    }
  }

  esInvalido(campo: string): boolean {
    const control = this.form.get(campo);
    return !!(control && control.invalid && (control.touched || this.enviado));
  }

  onSubmit(): void {
    this.enviado = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardando = true;
    const valores = this.form.value;

    if (this.esEdicion && this.rutaId !== null) {
      const estado: EstadoRuta =
        Number(valores.asientosDisponibles) === 0 ? 'Completa' : 'Activa';

      const payload: RutaCarpooling = {
        ...valores,
        id: this.rutaId,
        asientosTotales: Number(valores.asientosTotales),
        asientosDisponibles: Number(valores.asientosDisponibles),
        aporteSugerido: Number(valores.aporteSugerido),
        autor: this.autorOriginal,
        pasajeros: this.pasajerosActuales,
        estado
      };

      this.carpoolingService.actualizar(this.rutaId, payload).subscribe({
        next: () => {
          this.guardando = false;
          this.router.navigate(['/carpooling']);
        },
        error: () => {
          this.guardando = false;
          this.errorCarga = 'No se pudo actualizar la ruta.';
        }
      });
      return;
    }

    const nuevaRuta: Omit<RutaCarpooling, 'id'> = {
      ...valores,
      asientosTotales: Number(valores.asientosTotales),
      asientosDisponibles: Number(valores.asientosDisponibles),
      aporteSugerido: Number(valores.aporteSugerido),
      autor: this.sesionService.usuarioActivo(),
      pasajeros: [],
      estado: 'Activa'
    };

    this.carpoolingService.crear(nuevaRuta).subscribe({
      next: () => {
        this.guardando = false;
        this.router.navigate(['/carpooling']);
      },
      error: () => {
        this.guardando = false;
        this.errorCarga = 'No se pudo registrar la ruta. Verifica que el servidor backend esté activo.';
      }
    });
  }
}
