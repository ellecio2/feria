import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { VehiclesService } from '../../../../core/services/api/vehicles.service';
import { CreateVehicleDto } from '../../../../core/models';
import { VehiclesCreateFormComponent } from '../forms/vehicles-create-form.component';

@Component({
  selector: 'app-vehicles-create',
  standalone: true,
  imports: [CommonModule, RouterModule, VehiclesCreateFormComponent],
  template: `
    <div class="container-xxl">
      <div class="row">
        <div class="col-12">
          <!-- Breadcrumb -->
          <div class="row">
            <div class="col-12">
              <div class="page-title-box d-flex align-items-center justify-content-between">
                <h4 class="mb-0">Nuevo Vehículo</h4>
                <div class="page-title-right">
                  <ol class="breadcrumb m-0">
                    <li class="breadcrumb-item">
                      <a routerLink="/vehicles">Vehículos</a>
                    </li>
                    <li class="breadcrumb-item active">Nuevo</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <!-- Form Card -->
          <div class="card">
            <div class="card-header">
              <div class="row align-items-center">
                <div class="col">
                  <h4 class="card-title">Información del Vehículo</h4>
                  <p class="card-title-desc">Complete los datos del vehículo</p>
                </div>
                <div class="col-auto">
                  <button type="button" class="btn btn-soft-secondary" routerLink="/vehicles">
                    <i class="bx bx-arrow-back me-1"></i> Volver
                  </button>
                </div>
              </div>
            </div>

            <div class="card-body">
              <!-- Error Message -->
              <div *ngIf="error" class="alert alert-danger alert-dismissible fade show" role="alert">
                {{ error }}
                <button type="button" class="btn-close" (click)="error = null"></button>
              </div>

              <!-- Success Message -->
              <div *ngIf="success" class="alert alert-success alert-dismissible fade show" role="alert">
                {{ success }}
                <button type="button" class="btn-close" (click)="success = null"></button>
              </div>

              <!-- Formulario -->
              <app-vehicles-create-form
                #vehicleForm
                (submitForm)="onSubmitVehicle($event)"
                (cancelForm)="onCancel()"
              ></app-vehicles-create-form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card-title-desc {
      color: #6c757d;
      margin-bottom: 0;
    }
  `]
})
export class VehiclesCreateComponent {
  private vehiclesService = inject(VehiclesService);
  private router = inject(Router);

  error: string | null = null;
  success: string | null = null;

  onSubmitVehicle(formData: CreateVehicleDto) {
    this.error = null;
    this.success = null;

    // Activar loading en el formulario
    const formComponent = document.querySelector('app-vehicles-create-form') as any;
    if (formComponent) {
      formComponent.setLoading(true);
    }

    console.log('Payload a enviar:', formData);

    this.vehiclesService.create(formData).subscribe({
      next: (vehicle) => {
        if (formComponent) {
          formComponent.setLoading(false);
        }
        this.success = 'Vehículo creado exitosamente';
        
        setTimeout(() => {
          this.router.navigate(['/vehicles']);
        }, 2000);
      },
      error: (error) => {
        if (formComponent) {
          formComponent.setLoading(false);
        }
        this.error = error.error?.message || 'Error al crear el vehículo. Intente nuevamente.';
        console.error('Error creating vehicle:', error);
        console.error('Payload que causó el error:', formData);
      }
    });
  }

  onCancel() {
    this.router.navigate(['/vehicles']);
  }
}