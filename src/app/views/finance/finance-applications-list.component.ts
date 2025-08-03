import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FinanceApplicationsService } from '@core/services';
import { FinanceApplication, ApplicationStatus } from '@core/models';

@Component({
  selector: 'app-finance-applications-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
                  <h4 class="card-title">
                    <i class="bx bx-file-blank me-2 text-primary"></i>
                    Solicitudes de Financiamiento
                  </h4>
                  <p class="card-title-desc mb-0">Gestione las aplicaciones de crédito vehicular</p>
                </div>
                <div class="col-auto">
                  <div class="d-flex gap-2">
                    <!-- Filtros por Estado -->
                    <div class="dropdown">
                      <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                        <i class="bx bx-filter me-1"></i>
                        {{ getFilterStatusText() }}
                      </button>
                      <ul class="dropdown-menu">
                        <li>
                          <a class="dropdown-item" (click)="filterByStatus(null)">
                            <i class="bx bx-list-ul me-2"></i> Todas las Solicitudes
                          </a>
                        </li>
                        <li><hr class="dropdown-divider"></li>
                        <li>
                          <a class="dropdown-item" (click)="filterByStatus(ApplicationStatus.PENDIENTE)">
                            <span class="badge bg-warning me-2">●</span> Pendientes
                          </a>
                        </li>
                        <li>
                          <a class="dropdown-item" (click)="filterByStatus(ApplicationStatus.EN_REVISION)">
                            <span class="badge bg-info me-2">●</span> En Revisión
                          </a>
                        </li>
                        <li>
                          <a class="dropdown-item" (click)="filterByStatus(ApplicationStatus.APROBADA)">
                            <span class="badge bg-success me-2">●</span> Aprobadas
                          </a>
                        </li>
                        <li>
                          <a class="dropdown-item" (click)="filterByStatus(ApplicationStatus.RECHAZADA)">
                            <span class="badge bg-danger me-2">●</span> Rechazadas
                          </a>
                        </li>
                        <li>
                          <a class="dropdown-item" (click)="filterByStatus(ApplicationStatus.DOCUMENTOS_PENDIENTES)">
                            <span class="badge bg-secondary me-2">●</span> Documentos Pendientes
                          </a>
                        </li>
                      </ul>
                    </div>

                    <button class="btn btn-primary" (click)="createApplication()">
                      <i class="bx bx-plus me-1"></i> Nueva Solicitud
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-body">
              <!-- Loading -->
              <div *ngIf="loading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Cargando solicitudes...</span>
                </div>
              </div>

              <!-- Table -->
              <div *ngIf="!loading" class="table-responsive">
                <table class="table table-hover" *ngIf="applications.length > 0">
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Vehículo</th>
                      <th>Financiera</th>
                      <th>Monto Solicitado</th>
                      <th>Plazo</th>
                      <th>Estado</th>
                      <th>Fecha</th>
                      <th class="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let app of applications">
                      <td>
                        <div class="d-flex align-items-center">
                          <div class="avatar-sm rounded-circle bg-light d-flex align-items-center justify-content-center me-3">
                            <i class="bx bx-user text-primary"></i>
                          </div>
                          <div>
                            <h6 class="mb-0" *ngIf="app.client">
                              {{ app.client.firstName }} {{ app.client.lastName }}
                            </h6>
                            <small class="text-muted">ID: {{ app.clientId }}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div *ngIf="app.vehicle">
                          <h6 class="mb-0">{{ app.vehicle.brand }} {{ app.vehicle.model }}</h6>
                          <small class="text-muted">{{ app.vehicle.year }}</small>
                        </div>
                        <div *ngIf="!app.vehicle">
                          <small class="text-muted">ID: {{ app.vehicleId }}</small>
                        </div>
                      </td>
                      <td>
                        <div *ngIf="app.financeCompany">
                          <h6 class="mb-0">{{ app.financeCompany.companyName }}</h6>
                          <small class="text-muted">{{ app.financeCompany.interestRate }}% anual</small>
                        </div>
                        <div *ngIf="!app.financeCompany">
                          <small class="text-muted">ID: {{ app.financeCompanyId }}</small>
                        </div>
                      </td>
                      <td>
                        <span class="fw-bold text-success">
                          {{ formatCurrency(app.requestedAmount) }}
                        </span>
                        <div *ngIf="app.downPayment && app.downPayment > 0">
                          <small class="text-muted">
                            Inicial: {{ formatCurrency(app.downPayment) }}
                          </small>
                        </div>
                      </td>
                      <td>
                        <span class="badge bg-info-subtle text-info">
                          {{ app.financeMonths }} meses
                        </span>
                        <div *ngIf="app.monthlyPayment">
                          <small class="text-muted">
                            {{ formatCurrency(app.monthlyPayment) }}/mes
                          </small>
                        </div>
                      </td>
                      <td>
                        <span class="badge" [ngClass]="getStatusBadgeClass(app.status)">
                          {{ getStatusText(app.status) }}
                        </span>
                      </td>
                      <td>
                        <small class="text-muted">
                          {{ formatDate(app.createdAt) }}
                        </small>
                      </td>
                      <td class="text-center">
                        <div class="btn-group" role="group">
                          <button 
                            class="btn btn-sm btn-soft-info"
                            [routerLink]="['/finance/applications', app.id, 'view']"
                            title="Ver detalles"
                          >
                            <i class="bx bx-show"></i>
                          </button>
                          <button 
                            class="btn btn-sm btn-soft-warning"
                            [routerLink]="['/finance/applications', app.id, 'edit']"
                            title="Editar"
                            *ngIf="canEdit(app)"
                          >
                            <i class="bx bx-edit"></i>
                          </button>
                          <div class="dropdown">
                            <button class="btn btn-sm btn-soft-secondary dropdown-toggle" 
                                    type="button" data-bs-toggle="dropdown" title="Más acciones">
                              <i class="bx bx-dots-horizontal-rounded"></i>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end">
                              <li *ngIf="app.status === ApplicationStatus.PENDIENTE || app.status === ApplicationStatus.EN_REVISION">
                                <a class="dropdown-item text-success" (click)="quickApprove(app)">
                                  <i class="bx bx-check me-2"></i> Aprobar
                                </a>
                              </li>
                              <li *ngIf="app.status === ApplicationStatus.PENDIENTE || app.status === ApplicationStatus.EN_REVISION">
                                <a class="dropdown-item text-danger" (click)="quickReject(app)">
                                  <i class="bx bx-x me-2"></i> Rechazar
                                </a>
                              </li>
                              <li *ngIf="app.status !== ApplicationStatus.EN_REVISION">
                                <a class="dropdown-item text-info" (click)="markAsReview(app)">
                                  <i class="bx bx-time me-2"></i> Marcar en Revisión
                                </a>
                              </li>
                              <li><hr class="dropdown-divider"></li>
                              <li *ngIf="canDelete(app)">
                                <a class="dropdown-item text-danger" (click)="confirmDelete(app)">
                                  <i class="bx bx-trash me-2"></i> Eliminar
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <!-- Empty State -->
                <div *ngIf="applications.length === 0" class="text-center py-5">
                  <div class="mb-3">
                    <i class="bx bx-file-blank display-4 text-muted"></i>
                  </div>
                  <h5 class="text-muted">{{ getEmptyStateTitle() }}</h5>
                  <p class="text-muted mb-3">{{ getEmptyStateMessage() }}</p>
                  <button class="btn btn-primary" (click)="createApplication()" *ngIf="!currentFilter">
                    <i class="bx bx-plus me-1"></i> Crear Primera Solicitud
                  </button>
                  <button class="btn btn-outline-secondary" (click)="filterByStatus(null)" *ngIf="currentFilter">
                    <i class="bx bx-list-ul me-1"></i> Ver Todas las Solicitudes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="row mt-4" *ngIf="!loading && applications.length > 0">
      <div class="col-md-3">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="avatar-md rounded-circle bg-primary-subtle d-flex align-items-center justify-content-center me-3">
                <i class="bx bx-file-blank text-primary fs-3"></i>
              </div>
              <div>
                <h4 class="mb-0">{{ getTotalApplications() }}</h4>
                <p class="text-muted mb-0">Total Solicitudes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="avatar-md rounded-circle bg-warning-subtle d-flex align-items-center justify-content-center me-3">
                <i class="bx bx-time text-warning fs-3"></i>
              </div>
              <div>
                <h4 class="mb-0">{{ getPendingApplications() }}</h4>
                <p class="text-muted mb-0">Pendientes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="avatar-md rounded-circle bg-success-subtle d-flex align-items-center justify-content-center me-3">
                <i class="bx bx-check-circle text-success fs-3"></i>
              </div>
              <div>
                <h4 class="mb-0">{{ getApprovedApplications() }}</h4>
                <p class="text-muted mb-0">Aprobadas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="avatar-md rounded-circle bg-info-subtle d-flex align-items-center justify-content-center me-3">
                <i class="bx bx-dollar-circle text-info fs-3"></i>
              </div>
              <div>
                <h4 class="mb-0">{{ getTotalAmount() }}</h4>
                <p class="text-muted mb-0">Monto Total</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card-title-desc {
      color: #6c757d;
    }
    .avatar-sm {
      width: 2.5rem;
      height: 2.5rem;
    }
    .avatar-md {
      width: 3rem;
      height: 3rem;
    }
    .bg-primary-subtle {
      background-color: rgba(13, 110, 253, 0.1) !important;
    }
    .bg-success-subtle {
      background-color: rgba(25, 135, 84, 0.1) !important;
    }
    .bg-info-subtle {
      background-color: rgba(13, 202, 240, 0.1) !important;
    }
    .bg-warning-subtle {
      background-color: rgba(255, 193, 7, 0.1) !important;
    }
    .display-4 {
      font-size: 3rem;
    }
  `]
})
export class FinanceApplicationsListComponent implements OnInit {
  applications: FinanceApplication[] = [];
  allApplications: FinanceApplication[] = [];
  loading = true;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  currentFilter: ApplicationStatus | null = null;

  // Exponer el enum para usar en template
  ApplicationStatus = ApplicationStatus;

  constructor(
    private applicationsService: FinanceApplicationsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadApplications();
    this.checkForMessages();
  }

  checkForMessages() {
    const navigation = history.state;
    if (navigation?.message) {
      this.successMessage = navigation.message;
      history.replaceState({}, '', location.pathname);
    }
  }

  loadApplications() {
    this.loading = true;
    this.applicationsService.getAll().subscribe({
      next: (data) => {
        this.allApplications = data;
        this.applications = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading applications:', error);
        this.errorMessage = 'Error al cargar las solicitudes. Intente nuevamente.';
        this.loading = false;
      }
    });
  }

  filterByStatus(status: ApplicationStatus | null) {
    this.currentFilter = status;
    if (status) {
      this.applications = this.allApplications.filter(app => app.status === status);
    } else {
      this.applications = [...this.allApplications];
    }
  }

  getFilterStatusText(): string {
    if (!this.currentFilter) return 'Todas las Solicitudes';
    return this.getStatusText(this.currentFilter);
  }

  getStatusText(status: ApplicationStatus): string {
    const statusMap: Record<ApplicationStatus, string> = {
      [ApplicationStatus.PENDIENTE]: 'Pendiente',
      [ApplicationStatus.EN_REVISION]: 'En Revisión',
      [ApplicationStatus.APROBADA]: 'Aprobada',
      [ApplicationStatus.RECHAZADA]: 'Rechazada',
      [ApplicationStatus.DOCUMENTOS_PENDIENTES]: 'Documentos Pendientes'
    };
    return statusMap[status] || status;
  }

  getStatusBadgeClass(status: ApplicationStatus): string {
    const classMap: Record<ApplicationStatus, string> = {
      [ApplicationStatus.PENDIENTE]: 'bg-warning',
      [ApplicationStatus.EN_REVISION]: 'bg-info',
      [ApplicationStatus.APROBADA]: 'bg-success',
      [ApplicationStatus.RECHAZADA]: 'bg-danger',
      [ApplicationStatus.DOCUMENTOS_PENDIENTES]: 'bg-secondary'
    };
    return classMap[status] || 'bg-secondary';
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP'
    }).format(amount);
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('es-DO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getEmptyStateTitle(): string {
    if (this.currentFilter) {
      return `No hay solicitudes ${this.getStatusText(this.currentFilter).toLowerCase()}`;
    }
    return 'No hay solicitudes de financiamiento';
  }

  getEmptyStateMessage(): string {
    if (this.currentFilter) {
      return `No se encontraron solicitudes con estado "${this.getStatusText(this.currentFilter)}"`;
    }
    return 'Comience creando la primera solicitud de financiamiento';
  }

  // Stats methods
  getTotalApplications(): number {
    return this.allApplications.length;
  }

  getPendingApplications(): number {
    return this.allApplications.filter(app => 
      app.status === ApplicationStatus.PENDIENTE || app.status === ApplicationStatus.EN_REVISION
    ).length;
  }

  getApprovedApplications(): number {
    return this.allApplications.filter(app => app.status === ApplicationStatus.APROBADA).length;
  }

  getTotalAmount(): string {
    const total = this.allApplications.reduce((sum, app) => sum + app.requestedAmount, 0);
    return this.formatCurrency(total);
  }

  // Navigation methods
  createApplication() {
    this.router.navigate(['/finance/applications/create']);
  }

  // Quick actions
  quickApprove(app: FinanceApplication) {
    const monthlyPayment = prompt('Ingrese el pago mensual aprobado (opcional):');
    const payment = monthlyPayment ? parseFloat(monthlyPayment) : undefined;
    
    this.applicationsService.approve(app.id, payment).subscribe({
      next: (updated) => {
        this.successMessage = `Solicitud aprobada exitosamente`;
        this.updateApplicationInList(updated);
      },
      error: (error) => {
        this.errorMessage = 'Error al aprobar la solicitud';
        console.error(error);
      }
    });
  }

  quickReject(app: FinanceApplication) {
    const reason = prompt('Ingrese la razón del rechazo:');
    if (!reason) return;
    
    this.applicationsService.reject(app.id, reason).subscribe({
      next: (updated) => {
        this.successMessage = `Solicitud rechazada`;
        this.updateApplicationInList(updated);
      },
      error: (error) => {
        this.errorMessage = 'Error al rechazar la solicitud';
        console.error(error);
      }
    });
  }

  markAsReview(app: FinanceApplication) {
    this.applicationsService.markAsReview(app.id).subscribe({
      next: (updated) => {
        this.successMessage = `Solicitud marcada en revisión`;
        this.updateApplicationInList(updated);
      },
      error: (error) => {
        this.errorMessage = 'Error al actualizar la solicitud';
        console.error(error);
      }
    });
  }

  confirmDelete(app: FinanceApplication) {
    if (confirm(`¿Está seguro de eliminar la solicitud de ${app.client?.firstName || 'este cliente'}?`)) {
      this.applicationsService.delete(app.id).subscribe({
        next: () => {
          this.successMessage = 'Solicitud eliminada exitosamente';
          this.removeApplicationFromList(app.id);
        },
        error: (error) => {
          this.errorMessage = 'Error al eliminar la solicitud';
          console.error(error);
        }
      });
    }
  }

  // Helper methods
  updateApplicationInList(updated: FinanceApplication) {
    const index = this.allApplications.findIndex(app => app.id === updated.id);
    if (index !== -1) {
      this.allApplications[index] = updated;
      this.filterByStatus(this.currentFilter); // Reapply filter
    }
  }

  removeApplicationFromList(id: string) {
    this.allApplications = this.allApplications.filter(app => app.id !== id);
    this.filterByStatus(this.currentFilter); // Reapply filter
  }

  canEdit(app: FinanceApplication): boolean {
    // Solo se puede editar si está pendiente o en revisión
    return app.status === ApplicationStatus.PENDIENTE || app.status === ApplicationStatus.EN_REVISION;
  }

  canDelete(app: FinanceApplication): boolean {
    // Solo admin puede eliminar, y solo si no está aprobada
    return app.status !== ApplicationStatus.APROBADA;
  }
}