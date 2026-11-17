import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SesionService } from '../../../../core/services/sesion.service';
import { RutaCarpooling } from '../../models/ruta-carpooling.model';
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

  private readonly fechaHoy = new Date().toISOString().split('T')[0];

  form: FormGroup = this.fb.group({
    origen: ['', [Validators.required, Validators.minLength(3)]],
    destino: ['Campus UTP', [Validators.required, Validators.minLength(3)]],
    fecha: [this.fechaHoy, Validators.required],
    hora: ['07:30', Validators.required],
    vehiculo: ['', Validators.required],
    cupos: [3, [Validators.required, Validators.min(0)]],
    precio: [5.0, [Validators.required, Validators.min(0)]],
    contacto: ['', [Validators.required, Validators.pattern(/^9\d{8}$/)]]
  });

  // Getter para acceso directo a controles del formulario (igual que en flota-app)
  get f() {
    return this.form.controls;
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
        }
      });
    }
  }

  onSubmit(): void {
    this.enviado = true;

    if (this.form.invalid) {
      return;
    }

    const valores = this.form.value;

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
        conductor: this.conductorOriginal || this.sesionService.usuarioActivo()
      };

      this.carpoolingService.modificar(this.id, payload).subscribe({
        next: () => this.router.navigate(['/carpooling'])
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
        conductor: this.sesionService.usuarioActivo()
      };

      this.carpoolingService.agregar(nuevaRuta).subscribe({
        next: () => this.router.navigate(['/carpooling'])
      });
    }
  }
}
