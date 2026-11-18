import { Component, OnInit, inject } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SesionService } from '../../../../core/services/sesion.service';
import { Parada, RutaCarpooling } from '../../models/ruta-carpooling.model';
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
  id: number | null = null;
  enviado = false;
  conductorOriginal = '';
  errorBackend = '';

  readonly fechaHoy = this.obtenerFechaLocalHoy();

  form: FormGroup = this.fb.group(
    {
      origen: ['', [Validators.required, Validators.minLength(3)]],
      destino: ['Campus UTP', [Validators.required, Validators.minLength(3)]],
      fecha: [this.fechaHoy, Validators.required],
      hora: ['', [Validators.required, Validators.pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)]],
      vehiculo: ['', Validators.required],
      cupos: [3, [Validators.required, Validators.min(0)]],
      precio: [5.0, [Validators.required, Validators.min(0)]],
      contacto: ['', [Validators.required, Validators.pattern(/^9\d{8}$/)]],
      paradas: this.fb.array([])
    },
    { validators: this.validarFechaHoraFutura }
  );

  // Obtiene la fecha de hoy en formato YYYY-MM-DD usando la hora local (evita desfase UTC)
  private obtenerFechaLocalHoy(): string {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    return `${anio}-${mes}-${dia}`;
  }

  // Valida que la fecha y hora combinadas no sean anteriores al momento actual
  private validarFechaHoraFutura(group: AbstractControl): ValidationErrors | null {
    const fecha = group.get('fecha')?.value;
    const hora = group.get('hora')?.value;
    if (!fecha || !hora) return null;

    const fechaRuta = new Date(`${fecha}T${hora}:00`);
    if (isNaN(fechaRuta.getTime())) return null;

    return fechaRuta < new Date() ? { fechaPasada: true } : null;
  }

  // Getter para acceso directo a controles del formulario
  get f() {
    return this.form.controls;
  }

  // Getter para acceder a la lista dinámica de paradas (FormArray)
  get paradas(): FormArray {
    return this.form.get('paradas') as FormArray;
  }

  // Agrega una nueva fila (objeto Parada) al FormArray
  agregarParada(lugar = '', horaAprox = ''): void {
    const fila = this.fb.group({
      lugar: [lugar, [Validators.required, Validators.minLength(2)]],
      horaAprox: [horaAprox, [Validators.required, Validators.pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)]]
    });
    this.paradas.push(fila);
  }

  // Elimina una parada del FormArray según su posición
  eliminarParada(index: number): void {
    this.paradas.removeAt(index);
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.esEdicion = true;
      this.id = Number(idParam);
      this.carpoolingService.obtener(this.id).subscribe({
        next: (ruta) => {
          this.conductorOriginal = ruta.conductor;
          this.form.patchValue(ruta);
          this.paradas.clear();
          (ruta.paradas || []).forEach((p) => this.agregarParada(p.lugar, p.horaAprox));
        }
      });
    }
  }

  onSubmit(): void {
    this.enviado = true;
    this.errorBackend = '';

    if (this.form.invalid) {
      return;
    }

    const valores = this.form.value;
    const paradasLimpias: Parada[] = (valores.paradas || []).map((p: Parada) => ({
      lugar: p.lugar.trim(),
      horaAprox: p.horaAprox
    }));

    if (this.esEdicion && this.id !== null) {
      const payload: RutaCarpooling = {
        id: this.id,
        origen: valores.origen.trim(),
        destino: valores.destino.trim(),
        fecha: valores.fecha,
        hora: valores.hora,
        vehiculo: valores.vehiculo.trim(),
        cupos: Number(valores.cupos),
        precio: Number(valores.precio),
        contacto: valores.contacto.trim(),
        conductor: this.conductorOriginal || this.sesionService.usuarioActivo(),
        paradas: paradasLimpias
      };

      this.carpoolingService.modificar(this.id, payload).subscribe({
        next: () => this.router.navigate(['/rutas']),
        error: (err) => {
          this.errorBackend = err?.error?.mensaje || 'No se pudo actualizar la ruta.';
        }
      });
    } else {
      const nuevaRuta: Omit<RutaCarpooling, 'id'> = {
        origen: valores.origen.trim(),
        destino: valores.destino.trim(),
        fecha: valores.fecha,
        hora: valores.hora,
        vehiculo: valores.vehiculo.trim(),
        cupos: Number(valores.cupos),
        precio: Number(valores.precio),
        contacto: valores.contacto.trim(),
        conductor: this.sesionService.usuarioActivo(),
        paradas: paradasLimpias
      };

      this.carpoolingService.agregar(nuevaRuta).subscribe({
        next: () => this.router.navigate(['/rutas']),
        error: (err) => {
          this.errorBackend = err?.error?.mensaje || 'No se pudo publicar la ruta.';
        }
      });
    }
  }
}
