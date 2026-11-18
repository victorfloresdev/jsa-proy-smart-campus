import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SesionService } from '../../../../core/services/sesion.service';
import { ObjetosService } from '../../services/objetos.service';
import { TipoReporte } from '../../models/objeto-perdido.model';

@Component({
  selector: 'app-objeto-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './objeto-form.component.html',
})
export class ObjetoFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly objetosService = inject(ObjetosService);
  readonly sesionService = inject(SesionService);

  guardando = false;
  errorEnvio: string | null = null;

  readonly categorias: string[] = [
    'Académico',
    'Tecnología',
    'Accesorios',
    'Documentos',
    'Indumentaria',
    'Otros',
  ];

  readonly imagenPorDefecto =
    'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?w=400';

  readonly form = this.fb.nonNullable.group({
    titulo: ['', [Validators.required, Validators.minLength(3)]],
    tipo: ['Perdido' as TipoReporte, [Validators.required]],
    categoria: ['Académico', [Validators.required]],
    ubicacion: ['', [Validators.required]],
    fechaSuceso: [new Date().toISOString().split('T')[0], [Validators.required]],
    descripcion: ['', [Validators.required, Validators.minLength(8)]],
    imagenUrl: [''],
    contacto: ['', [Validators.required]],
  });

  esInvalido(campo: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[campo];
    return control.invalid && (control.dirty || control.touched);
  }

  onVistaPreviaError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img.src !== this.imagenPorDefecto) {
      img.src = this.imagenPorDefecto;
    }
  }

  onSubmit(): void {
    if (this.form.invalid || this.guardando) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.errorEnvio = null;

    const valores = this.form.getRawValue();

    this.objetosService
      .publicar({
        ...valores,
        imagenUrl: valores.imagenUrl.trim() || this.imagenPorDefecto,
        estado: 'Activo',
        autor: this.sesionService.usuarioActivo(),
      })
      .subscribe({
        next: () => {
          this.guardando = false;
          this.router.navigate(['/objetos-perdidos']);
        },
        error: () => {
          this.guardando = false;
          this.errorEnvio =
            'No se pudo guardar la publicación. Verifica que el backend esté activo.';
        },
      });
  }
}