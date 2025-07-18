import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VehiclesService, Vehicle } from '@/app/core/services/api/vehicles.service';

@Component({
  selector: 'app-vehicles-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-xxl">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <div class="row align-items-center">
                <div class="col">
                  <h4 class="card-title">Vehículos</h4>
                </div>
                <div class="col-auto">
                  <button class="btn btn-primary" routerLink="/vehicles/create">
                    <i class="bx bx-plus me-1"></i> Nuevo Vehículo
                  </button>
                </div>
              </div>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-hover">
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
                      <td>{{ vehicle.price | currency:'DOP' }}</td>
                      <td>
                        <span class="badge" [ngClass]="getStatusClass(vehicle.status)">
                          {{ getStatusLabel(vehicle.status) }}
                        </span>
                      </td>
                      <td>
                        <button class="btn btn-sm btn-soft-info me-1">
                          <i class="bx bx-show"></i>
                        </button>
                        <button class="btn btn-sm btn-soft-warning me-1">
                          <i class="bx bx-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-soft-danger">
                          <i class="bx bx-trash"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div *ngIf="loading" class="text-center py-4">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                  </div>
                </div>
                <div *ngIf="!loading && vehicles.length === 0" class="text-center py-4">
                  <p class="text-muted">No hay vehículos registrados</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .badge {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
    }
  `]
})
export class VehiclesListComponent implements OnInit {
  vehicles: Vehicle[] = [];
  loading = true;

  constructor(private vehiclesService: VehiclesService) {}

  ngOnInit() {
    this.loadVehicles();
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
        this.loading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'disponible': 'bg-success',
      'en_evaluacion': 'bg-warning',
      'reservado': 'bg-info',
      'vendido_financiado': 'bg-primary',
      'vendido_cash': 'bg-secondary',
      'entregado': 'bg-dark'
    };
    return statusClasses[status] || 'bg-secondary';
  }

  getStatusLabel(status: string): string {
    const statusLabels: { [key: string]: string } = {
      'disponible': 'Disponible',
      'en_evaluacion': 'En Evaluación',
      'reservado': 'Reservado',
      'vendido_financiado': 'Vendido (Financiado)',
      'vendido_cash': 'Vendido (Efectivo)',
      'entregado': 'Entregado'
    };
    return statusLabels[status] || status;
  }
}
