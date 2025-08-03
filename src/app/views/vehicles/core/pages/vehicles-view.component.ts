import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { VehiclesService } from '../../../../core/services/api/vehicles.service';
import { Vehicle, VehicleStatus } from '../../../../core/models';

@Component({
  selector: 'app-vehicles-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-xxl">
      <div class="row">
        <div class="col-12">
          <!-- Breadcrumb -->
          <div class="row">
            <div class="col-12">
              <div class="page-title-box d-flex align-items-center justify-content-between">
                <h4 class="mb-0">Detalles del Vehículo</h4>
                <div class="page-title-right">
                  <ol class="breadcrumb m-0">
                    <li class="breadcrumb-item">
                      <a routerLink="/vehicles">Vehículos</a>
                    </li>
                    <li class="breadcrumb-item active">Detalles</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <!-- Loading -->
          <div *ngIf="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
          </div>

          <!-- Error -->
          <div *ngIf="error && !loading" class="alert alert-danger">
            {{ error }}
            <div class="mt-3">
              <button class="btn btn-secondary" routerLink="/vehicles">
                <i class="bx bx-arrow-back me-1"></i> Volver a la lista
              </button>
            </div>
          </div>

          <!-- Vehicle Details -->
          <div *ngIf="vehicle && !loading" class="row">
            <!-- Header Card -->
            <div class="col-12 mb-4">
              <div class="card">
                <div class="card-header">
                  <div class="row align-items-center">
                    <div class="col">
                      <h4 class="card-title">{{ vehicle.brand }} {{ vehicle.model }} {{ vehicle.year }}</h4>
                      <p class="card-title-desc mb-0">
                        <span class="badge" [ngClass]="getStatusClass(vehicle.status)">
                          {{ getStatusLabel(vehicle.status) }}
                        </span>
                      </p>
                    </div>
                    <div class="col-auto">
                      <div class="d-flex gap-2">
                        <button 
                          type="button" 
                          class="btn btn-soft-secondary" 
                          routerLink="/vehicles"
                        >
                          <i class="bx bx-arrow-back me-1"></i> Volver
                        </button>
                        <button 
                          type="button" 
                          class="btn btn-warning" 
                          [routerLink]="['/vehicles', vehicle.id, 'edit']"
                        >
                          <i class="bx bx-edit me-1"></i> Editar
                        </button>
                        <button 
                          type="button" 
                          class="btn btn-danger" 
                          (click)="confirmDelete()"
                        >
                          <i class="bx bx-trash me-1"></i> Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Basic Information -->
            <div class="col-lg-8 mb-4">
              <div class="card">
                <div class="card-header">
                  <h5 class="card-title mb-0">
                    <i class="bx bx-car me-1 text-primary"></i> Información Básica
                  </h5>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label class="form-label fw-bold">Marca:</label>
                      <p class="mb-0">{{ vehicle.brand }}</p>
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label fw-bold">Modelo:</label>
                      <p class="mb-0">{{ vehicle.model }}</p>
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label fw-bold">Año:</label>
                      <p class="mb-0">{{ vehicle.year }}</p>
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label fw-bold">Color:</label>
                      <p class="mb-0">{{ vehicle.color || 'No especificado' }}</p>
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label fw-bold">Combustible:</label>
                      <p class="mb-0">{{ vehicle.fuelType || 'No especificado' }}</p>
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label fw-bold">Transmisión:</label>
                      <p class="mb-0">{{ vehicle.transmission || 'No especificado' }}</p>
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label fw-bold">Placa:</label>
                      <p class="mb-0">{{ vehicle.plate || 'Sin placa' }}</p>
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label fw-bold">Condición:</label>
                      <p class="mb-0 text-capitalize">{{ vehicle.condition }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pricing & Stats -->
            <div class="col-lg-4 mb-4">
              <div class="card">
                <div class="card-header">
                  <h5 class="card-title mb-0">
                    <i class="bx bx-dollar-circle me-1 text-success"></i> Precios
                  </h5>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <label class="form-label fw-bold">Precio Original:</label>
                    <p class="mb-0 fs-5 text-success">{{ vehicle.originalPrice | currency:'DOP' }}</p>
                  </div>
                  <div class="mb-3" *ngIf="vehicle.currentPrice">
                    <label class="form-label fw-bold">Precio Actual:</label>
                    <p class="mb-0 fs-5 text-primary">{{ vehicle.currentPrice | currency:'DOP' }}</p>
                  </div>
                  <div class="mb-3" *ngIf="vehicle.minAcceptablePrice">
                    <label class="form-label fw-bold">Precio Mínimo:</label>
                    <p class="mb-0 fs-6 text-muted">{{ vehicle.minAcceptablePrice | currency:'DOP' }}</p>
                  </div>
                </div>
              </div>

              <!-- Stats -->
              <div class="card">
                <div class="card-header">
                  <h5 class="card-title mb-0">
                    <i class="bx bx-bar-chart me-1 text-info"></i> Estadísticas
                  </h5>
                </div>
                <div class="card-body">
                  <div class="d-flex justify-content-between mb-2">
                    <span>Visualizaciones:</span>
                    <span class="fw-bold">{{ vehicle.viewsCount }}</span>
                  </div>
                  <div class="d-flex justify-content-between">
                    <span>Escaneos QR:</span>
                    <span class="fw-bold">{{ vehicle.scansCount }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Technical Specifications -->
            <div class="col-lg-6 mb-4">
              <div class="card">
                <div class="card-header">
                  <h5 class="card-title mb-0">
                    <i class="bx bx-cog me-1 text-warning"></i> Especificaciones Técnicas
                  </h5>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label class="form-label fw-bold">Motor:</label>
                      <p class="mb-0">{{ vehicle.engine || 'No especificado' }}</p>
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label fw-bold">Kilometraje:</label>
                      <p class="mb-0">{{ vehicle.mileage | number }} km</p>
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label fw-bold">Puertas:</label>
                      <p class="mb-0">{{ vehicle.doors || 'No especificado' }}</p>
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label fw-bold">Asientos:</label>
                      <p class="mb-0">{{ vehicle.seats || 'No especificado' }}</p>
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label fw-bold">Propietarios Anteriores:</label>
                      <p class="mb-0">{{ vehicle.previousOwners || 0 }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Description & Accidents -->
            <div class="col-lg-6 mb-4">
              <div class="card">
                <div class="card-header">
                  <h5 class="card-title mb-0">
                    <i class="bx bx-info-circle me-1 text-info"></i> Información Adicional
                  </h5>
                </div>
                <div class="card-body">
                  <div class="mb-3" *ngIf="vehicle.description">
                    <label class="form-label fw-bold">Descripción:</label>
                    <p class="mb-0">{{ vehicle.description }}</p>
                  </div>
                  
                  <div class="mb-3">
                    <label class="form-label fw-bold">Historial de Accidentes:</label>
                    <div *ngIf="vehicle.accident; else noAccidents">
                      <span class="badge bg-warning mb-2">Ha tenido accidentes</span>
                      <p class="mb-0" *ngIf="vehicle.accidentDescription">
                        {{ vehicle.accidentDescription }}
                      </p>
                    </div>
                    <ng-template #noAccidents>
                      <span class="badge bg-success">Sin accidentes</span>
                    </ng-template>
                  </div>

                  <div class="mb-3">
                    <label class="form-label fw-bold">Fecha de Registro:</label>
                    <p class="mb-0">{{ vehicle.createdAt | date:'medium' }}</p>
                  </div>
                  
                  <div *ngIf="vehicle.updatedAt !== vehicle.createdAt">
                    <label class="form-label fw-bold">Última Actualización:</label>
                    <p class="mb-0">{{ vehicle.updatedAt | date:'medium' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal fade" id="deleteModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirmar Eliminación</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <p>¿Está seguro de que desea eliminar este vehículo?</p>
            <div class="alert alert-warning">
              <i class="bx bx-warning me-2"></i>
              <strong>{{ vehicle?.brand }} {{ vehicle?.model }} {{ vehicle?.year }}</strong>
              <br>Esta acción no se puede deshacer.
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button 
              type="button" 
              class="btn btn-danger" 
              (click)="deleteVehicle()"
              [disabled]="deleting"
            >
              <span *ngIf="deleting" class="spinner-border spinner-border-sm me-1"></span>
              {{ deleting ? 'Eliminando...' : 'Eliminar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card-title-desc {
      color: #6c757d;
    }
    .fw-bold {
      font-weight: 600;
    }
    .badge {
      font-size: 0.75rem;
    }
  `]
})
export class VehiclesViewComponent implements OnInit {
  private vehiclesService = inject(VehiclesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  vehicle: Vehicle | null = null;
  loading = true;
  deleting = false;
  error: string | null = null;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadVehicle(id);
    } else {
      this.router.navigate(['/vehicles']);
    }
  }

  loadVehicle(id: string) {
    this.loading = true;
    this.error = null;

    this.vehiclesService.getById(id).subscribe({
      next: (vehicle) => {
        this.vehicle = vehicle;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'Error al cargar el vehículo';
        this.loading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'DISPONIBLE': 'bg-success',
      'EN_EVALUACION': 'bg-warning',
      'RESERVADO': 'bg-info',
      'VENDIDO_FINANCIADO': 'bg-primary',
      'VENDIDO_CASH': 'bg-secondary',
      'ENTREGADO': 'bg-dark',
      'EN_MANTENIMIENTO': 'bg-danger',
      'INACTIVO': 'bg-secondary'
    };
    return statusClasses[status] || 'bg-secondary';
  }

  getStatusLabel(status: string): string {
    const statusLabels: { [key: string]: string } = {
      'DISPONIBLE': 'Disponible',
      'EN_EVALUACION': 'En Evaluación',
      'RESERVADO': 'Reservado',
      'VENDIDO_FINANCIADO': 'Vendido (Financiado)',
      'VENDIDO_CASH': 'Vendido (Efectivo)',
      'ENTREGADO': 'Entregado',
      'EN_MANTENIMIENTO': 'En Mantenimiento',
      'INACTIVO': 'Inactivo'
    };
    return statusLabels[status] || status;
  }

  confirmDelete() {
    // Aquí podrías usar Bootstrap modal o un servicio de confirmación
    const modal = new (window as any).bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
  }

  deleteVehicle() {
    if (!this.vehicle) return;

    this.deleting = true;
    
    this.vehiclesService.delete(this.vehicle.id).subscribe({
      next: () => {
        this.deleting = false;
        // Cerrar modal
        const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        modal?.hide();
        
        // Navegar con mensaje de éxito
        this.router.navigate(['/vehicles'], { 
          state: { message: 'Vehículo eliminado exitosamente' } 
        });
      },
      error: (error) => {
        this.deleting = false;
        this.error = error.error?.message || 'Error al eliminar el vehículo';
      }
    });
  }
}