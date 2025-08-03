import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { VehiclesService } from '../../../../core/services/api/vehicles.service';
import { Vehicle, UpdateVehicleDto } from '../../../../core/models';
import { VehiclesUpdateFormComponent } from '../forms/vehicles-update-form.component';

@Component({
  selector: 'app-vehicles-update',
  standalone: true,
  imports: [CommonModule, RouterModule, VehiclesUpdateFormComponent],
  template: `
    <div class="container-xxl">
      <div class="row">
        <div class="col-12">
          <!-- Breadcrumb -->
          <div class="row">
            <div class="col-12">
              <div class="page-title-box d-flex align-items-center justify-content-between">
                <h4 class="mb-0">Editar Vehículo</h4>
                <div class="page-title-right">
                  <ol class="breadcrumb m-0">
                    <li class="breadcrumb-item">
                      <a routerLink="/vehicles">Vehículos</a>
                    </li>
                    <li class="breadcrumb-item">
                      <a [routerLink]="['/vehicles', vehicleId, 'view']" *ngIf="vehicleId">Ver</a>
                    </li>
                    <li class="breadcrumb-item active">Editar</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <!-- Loading -->
          <div *ngIf="loadingVehicle" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando vehículo...</span>
            </div>
          </div>

          <!-- Error loading vehicle -->
          <div *ngIf="loadError && !loadingVehicle" class="alert alert-danger">
            {{ loadError }}
            <div class="mt-3">
              <button class="btn btn-secondary" routerLink="/vehicles">
                <i class="bx bx-arrow-back me-1"></i> Volver a la lista
              </button>
            </div>
          </div>

          <!-- Form Card -->
          <div *ngIf="vehicle && !loadingVehicle" class="card">
            <div class="card-header">
              <div class="row align-items-center">
                <div class="col">
                  <h4 class="card-title">
                    Editar: {{ vehicle.brand }} {{ vehicle.model }} {{ vehicle.year }}
                  </h4>
                  <p class="card-title-desc">Modifique los datos del vehículo</p>
                </div>
                <div class="col-auto">
                  <div class="d-flex gap-2">
                    <button 
                      type="button" 
                      class="btn btn-soft-info" 
                      [routerLink]="['/vehicles', vehicle.id, 'view']"
                    >
                      <i class="bx bx-show me-1"></i> Ver Detalles
                    </button>
                    <button type="button" class="btn btn-soft-secondary" routerLink="/vehicles">
                      <i class="bx bx-arrow-back me-1"></i> Volver
                    </button>
                  </div>
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
              <app-vehicles-update-form
                #vehicleFormRef
                [vehicle]="vehicle"
                (submitForm)="onUpdateVehicle($event)"
                (cancelForm)="onCancel()"
              ></app-vehicles-update-form>
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
export class VehiclesUpdateComponent implements OnInit {
  private vehiclesService = inject(VehiclesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // ✅ Usar ViewChild para obtener referencia al formulario
  @ViewChild('vehicleFormRef') vehicleFormComponent!: VehiclesUpdateFormComponent;

  vehicle: Vehicle | null = null;
  vehicleId: string | null = null;
  loadingVehicle = true;
  loadError: string | null = null;
  error: string | null = null;
  success: string | null = null;

  ngOnInit() {
    this.vehicleId = this.route.snapshot.paramMap.get('id');
    if (this.vehicleId) {
      this.loadVehicle(this.vehicleId);
    } else {
      this.router.navigate(['/vehicles']);
    }
  }

  loadVehicle(id: string) {
    this.loadingVehicle = true;
    this.loadError = null;

    this.vehiclesService.getById(id).subscribe({
      next: (vehicle) => {
        this.vehicle = vehicle;
        this.loadingVehicle = false;
      },
      error: (error) => {
        this.loadError = error.error?.message || 'Error al cargar el vehículo';
        this.loadingVehicle = false;
      }
    });
  }

  onUpdateVehicle(formData: UpdateVehicleDto) {
    if (!this.vehicle) return;

    this.error = null;
    this.success = null;

    // ✅ Activar loading en el formulario usando ViewChild
    this.vehicleFormComponent.setLoading(true);

    console.log('Datos a actualizar:', formData);

    this.vehiclesService.update(this.vehicle.id, formData).subscribe({
      next: (updatedVehicle) => {
        // ✅ Desactivar loading usando ViewChild
        this.vehicleFormComponent.setLoading(false);
        
        this.success = 'Vehículo actualizado exitosamente';
        
        // Actualizar el vehículo local
        this.vehicle = updatedVehicle;
        
        setTimeout(() => {
          this.router.navigate(['/vehicles', this.vehicle!.id, 'view']);
        }, 2000);
      },
      error: (error) => {
        // ✅ Desactivar loading usando ViewChild
        this.vehicleFormComponent.setLoading(false);
        
        this.error = error.error?.message || 'Error al actualizar el vehículo. Intente nuevamente.';
        console.error('Error updating vehicle:', error);
        console.error('Datos que causaron el error:', formData);
      }
    });
  }

  onCancel() {
    if (this.vehicle) {
      this.router.navigate(['/vehicles', this.vehicle.id, 'view']);
    } else {
      this.router.navigate(['/vehicles']);
    }
  }
}