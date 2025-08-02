import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VehiclesService } from '@/app/core/services/api/vehicles.service';
import { Vehicle } from '@core/models';
import { VehicleDeleteModalComponent } from './core/modals/vehicle-delete-modal.components';

@Component({
  selector: 'app-vehicles-list',
  standalone: true,
  imports: [CommonModule, RouterModule, VehicleDeleteModalComponent],
  template: `
    <div class="container-xxl">
      <div class="row">
        <div class="col-12">
          <!-- Success Message -->
          <div *ngIf="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
            {{ successMessage }}
            <button type="button" class="btn-close" (click)="successMessage = null"></button>
          </div>

          <!-- Error Message -->
          <div *ngIf="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
            {{ errorMessage }}
            <button type="button" class="btn-close" (click)="errorMessage = null"></button>
          </div>

          <div class="card">
            <div class="card-header">
              <div class="row align-items-center">
                <div class="col">
                  <h4 class="card-title">Vehículos</h4>
                  <p class="card-title-desc mb-0">Gestione los vehículos registrados</p>
                </div>
                <div class="col-auto">
                  <button class="btn btn-primary" routerLink="/vehicles/create">
                    <i class="bx bx-plus me-1"></i> Nuevo Vehículo
                  </button>
                </div>
              </div>
            </div>
            <div class="card-body">
              <!-- Loading -->
              <div *ngIf="loading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Cargando vehículos...</span>
                </div>
              </div>

              <!-- Table -->
              <div *ngIf="!loading" class="table-responsive">
                <table class="table table-hover" *ngIf="vehicles.length > 0">
                  <thead>
                    <tr>
                      <th>Marca</th>
                      <th>Modelo</th>
                      <th>Año</th>
                      <th>Precio</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let vehicle of vehicles">
                      <td>{{ vehicle.brand }}</td>
                      <td>{{ vehicle.model }}</td>
                      <td>{{ vehicle.year }}</td>
                      <td>{{ vehicle.originalPrice | currency:'DOP' }}</td>
                      <td>
                        <span class="badge" [ngClass]="getStatusClass(vehicle.status)">
                          {{ getStatusLabel(vehicle.status) }}
                        </span>
                      </td>
                      <td>
                        <div class="btn-group" role="group">
                          <button 
                            class="btn btn-sm btn-soft-info"
                            [routerLink]="['/vehicles', vehicle.id, 'view']"
                            title="Ver detalles"
                          >
                            <i class="bx bx-show"></i>
                          </button>
                          <button 
                            class="btn btn-sm btn-soft-warning"
                            [routerLink]="['/vehicles', vehicle.id, 'edit']"
                            title="Editar"
                          >
                            <i class="bx bx-edit"></i>
                          </button>
                          <button 
                            class="btn btn-sm btn-soft-danger"
                            (click)="confirmDelete(vehicle)"
                            title="Eliminar"
                            [disabled]="deleting"
                          >
                            <i class="bx bx-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <!-- Empty State -->
                <div *ngIf="vehicles.length === 0" class="text-center py-5">
                  <div class="mb-3">
                    <i class="bx bx-car display-4 text-muted"></i>
                  </div>
                  <h5 class="text-muted">No hay vehículos registrados</h5>
                  <p class="text-muted mb-3">Comience agregando su primer vehículo</p>
                  <button class="btn btn-primary" routerLink="/vehicles/create">
                    <i class="bx bx-plus me-1"></i> Agregar Vehículo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Modal Component -->
    <app-vehicle-delete-modal
      #deleteModal
      [vehicle]="vehicleToDelete"
      [deleting]="deleting"
      [errorMessage]="deleteErrorMessage"
      (confirmDeleteEvent)="deleteVehicle()"
      (modalClosedEvent)="onModalClosed()"
    ></app-vehicle-delete-modal>
  `,
  styles: [`
    .badge {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
    }
    .btn-group .btn {
      margin-right: 0.25rem;
    }
    .btn-group .btn:last-child {
      margin-right: 0;
    }
    .card-title-desc {
      color: #6c757d;
    }
    .display-4 {
      font-size: 3rem;
    }
  `]
})
export class VehiclesListComponent implements OnInit {
  @ViewChild('deleteModal') deleteModal!: VehicleDeleteModalComponent;

  vehicles: Vehicle[] = [];
  loading = true;
  deleting = false;
  vehicleToDelete: Vehicle | null = null;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  deleteErrorMessage: string | null = null; // Error específico del modal

  constructor(private vehiclesService: VehiclesService) {}

  ngOnInit() {
    this.loadVehicles();
    this.checkForMessages();
  }

  checkForMessages() {
    // Verificar si hay un mensaje de éxito desde navegación
    const navigation = history.state;
    if (navigation?.message) {
      this.successMessage = navigation.message;
      // Limpiar el estado para evitar que se muestre nuevamente
      history.replaceState({}, '', location.pathname);
    }
  }

  loadVehicles() {
    this.loading = true;
    this.vehiclesService.getAll().subscribe({
      next: (data) => {
        this.vehicles = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading vehicles:', error);
        this.errorMessage = 'Error al cargar los vehículos. Intente nuevamente.';
        this.loading = false;
      }
    });
  }

  confirmDelete(vehicle: Vehicle) {
    this.vehicleToDelete = vehicle;
    this.deleteErrorMessage = null;
    this.deleteModal.showModal();
  }

  deleteVehicle() {
    if (!this.vehicleToDelete) return;

    this.deleting = true;
    this.deleteErrorMessage = null;

    this.vehiclesService.delete(this.vehicleToDelete.id).subscribe({
      next: () => {
        this.deleting = false;
        
        // Cerrar modal
        this.deleteModal.hideModal();
        
        // Mostrar mensaje de éxito
        this.successMessage = `Vehículo ${this.vehicleToDelete!.brand} ${this.vehicleToDelete!.model} eliminado exitosamente`;
        
        // Remover el vehículo de la lista local
        this.vehicles = this.vehicles.filter(v => v.id !== this.vehicleToDelete!.id);
        
        // Limpiar el vehículo seleccionado
        this.vehicleToDelete = null;
      },
      error: (error) => {
        this.deleting = false;
        console.error('Error deleting vehicle:', error);
        
        // Mostrar error en el modal
        this.deleteErrorMessage = error.error?.message || 'Error al eliminar el vehículo. Intente nuevamente.';
      }
    });
  }

  onModalClosed() {
    // Limpiar estado cuando se cierra el modal
    this.vehicleToDelete = null;
    this.deleteErrorMessage = null;
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
    return statusClasses[status?.toUpperCase()] || 'bg-secondary';
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
    return statusLabels[status?.toUpperCase()] || status;
  }
}
