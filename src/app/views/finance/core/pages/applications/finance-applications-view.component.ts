import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FinanceApplicationsService } from '@core/services';
import { FinanceApplication, ApplicationStatus } from '@core/models';

@Component({
  selector: 'app-finance-applications-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-xxl">
      <div class="row">
        <div class="col-12">
          <!-- Breadcrumb -->
          <div class="page-title-box d-sm-flex align-items-center justify-content-between">
            <h4 class="mb-sm-0">Detalles de Solicitud</h4>
            <div class="page-title-right">
              <ol class="breadcrumb m-0">
                <li class="breadcrumb-item">
                  <a routerLink="/finance">Finanzas</a>
                </li>
                <li class="breadcrumb-item">
                  <a routerLink="/finance/applications">Solicitudes</a>
                </li>
                <li class="breadcrumb-item active">Ver Solicitud</li>
              </ol>
            </div>
          </div>

          <!-- Loading -->
          <div *ngIf="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando solicitud...</span>
            </div>
          </div>

          <!-- Error -->
          <div *ngIf="errorMessage" class="alert alert-danger" role="alert">
            {{ errorMessage }}
          </div>

          <!-- Application Details -->
          <div *ngIf="application && !loading">
            <!-- Header Card -->
            <div class="card mb-4">
              <div class="card-body">
                <div class="row align-items-center">
                  <div class="col">
                    <div class="d-flex align-items-center">
                      <div class="avatar-md rounded-circle bg-primary-subtle d-flex align-items-center justify-content-center me-3">
                        <i class="bx bx-file-blank text-primary fs-3"></i>
                      </div>
                      <div>
                        <h5 class="mb-1">Solicitud #{{ application.id.substring(0, 8) }}</h5>
                        <p class="text-muted mb-0">
                          Creada el {{ formatDate(application.createdAt) }}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="col-auto">
                    <div class="d-flex gap-2">
                      <span class="badge fs-6 px-3 py-2" [ngClass]="getStatusBadgeClass(application.status)">
                        {{ getStatusText(application.status) }}
                      </span>
                      <button 
                        class="btn btn-outline-primary btn-sm"
                        [routerLink]="['/finance/applications', application.id, 'edit']"
                        *ngIf="canEdit()"
                      >
                        <i class="bx bx-edit me-1"></i> Editar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="row">
              <!-- Client Information -->
              <div class="col-xl-6">
                <div class="card">
                  <div class="card-header">
                    <h5 class="card-title mb-0">
                      <i class="bx bx-user me-2"></i>Información del Cliente
                    </h5>
                  </div>
                  <div class="card-body">
                    <div *ngIf="application.client">
                      <div class="table-responsive">
                        <table class="table table-borderless mb-0">
                          <tbody>
                            <tr>
                              <td class="fw-semibold">Nombre:</td>
                              <td>{{ application.client.firstName }} {{ application.client.lastName }}</td>
                            </tr>
                            <tr>
                              <td class="fw-semibold">Email:</td>
                              <td>{{ application.client.email }}</td>
                            </tr>
                            <tr *ngIf="application.client.phone">
                              <td class="fw-semibold">Teléfono:</td>
                              <td>{{ application.client.phone }}</td>
                            </tr>
                            <tr *ngIf="application.client.cedula">
                              <td class="fw-semibold">Cédula:</td>
                              <td>{{ application.client.cedula }}</td>
                            </tr>
                            <tr *ngIf="application.client.monthlyIncome">
                              <td class="fw-semibold">Ingresos Mensuales:</td>
                              <td>{{ formatCurrency(application.client.monthlyIncome) }}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div *ngIf="!application.client" class="text-muted">
                      <i class="bx bx-info-circle me-2"></i>
                      Cliente ID: {{ application.clientId }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Vehicle Information -->
              <div class="col-xl-6">
                <div class="card">
                  <div class="card-header">
                    <h5 class="card-title mb-0">
                      <i class="bx bx-car me-2"></i>Información del Vehículo
                    </h5>
                  </div>
                  <div class="card-body">
                    <div *ngIf="application.vehicle">
                      <div class="table-responsive">
                        <table class="table table-borderless mb-0">
                          <tbody>
                            <tr>
                              <td class="fw-semibold">Marca:</td>
                              <td>{{ application.vehicle.brand }}</td>
                            </tr>
                            <tr>
                              <td class="fw-semibold">Modelo:</td>
                              <td>{{ application.vehicle.model }}</td>
                            </tr>
                            <tr>
                              <td class="fw-semibold">Año:</td>
                              <td>{{ application.vehicle.year }}</td>
                            </tr>
                            <tr *ngIf="application.vehicle.price">
                              <td class="fw-semibold">Precio:</td>
                              <td>{{ formatCurrency(application.vehicle.price) }}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div *ngIf="!application.vehicle" class="text-muted">
                      <i class="bx bx-info-circle me-2"></i>
                      Vehículo ID: {{ application.vehicleId }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Finance Details -->
              <div class="col-xl-8">
                <div class="card">
                  <div class="card-header">
                    <h5 class="card-title mb-0">
                      <i class="bx bx-dollar-circle me-2"></i>Detalles del Financiamiento
                    </h5>
                  </div>
                  <div class="card-body">
                    <div class="row">
                      <div class="col-md-6">
                        <div class="table-responsive">
                          <table class="table table-borderless mb-0">
                            <tbody>
                              <tr>
                                <td class="fw-semibold">Monto Solicitado:</td>
                                <td class="text-success fw-bold">
                                  {{ formatCurrency(application.requestedAmount) }}
                                </td>
                              </tr>
                              <tr>
                                <td class="fw-semibold">Pago Inicial:</td>
                                <td>{{ formatCurrency(application.downPayment) }}</td>
                              </tr>
                              <tr>
                                <td class="fw-semibold">Monto a Financiar:</td>
                                <td class="fw-bold">
                                  {{ formatCurrency(application.requestedAmount - application.downPayment) }}
                                </td>
                              </tr>
                              <tr>
                                <td class="fw-semibold">Plazo:</td>
                                <td>{{ application.financeMonths }} meses</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="table-responsive">
                          <table class="table table-borderless mb-0">
                            <tbody>
                              <tr *ngIf="application.financeCompany">
                                <td class="fw-semibold">Financiera:</td>
                                <td>{{ application.financeCompany.companyName }}</td>
                              </tr>
                              <tr *ngIf="application.financeCompany">
                                <td class="fw-semibold">Tasa de Interés:</td>
                                <td>{{ application.financeCompany.interestRate }}% anual</td>
                              </tr>
                              <tr *ngIf="application.monthlyPayment">
                                <td class="fw-semibold">Pago Mensual:</td>
                                <td class="text-info fw-bold">
                                  {{ formatCurrency(application.monthlyPayment) }}
                                </td>
                              </tr>
                              <tr *ngIf="application.rejectionReason">
                                <td class="fw-semibold">Razón del Rechazo:</td>
                                <td class="text-danger">{{ application.rejectionReason }}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Status Timeline -->
              <div class="col-xl-4">
                <div class="card">
                  <div class="card-header">
                    <h5 class="card-title mb-0">
                      <i class="bx bx-time me-2"></i>Estado de la Solicitud
                    </h5>
                  </div>
                  <div class="card-body">
                    <div class="text-center mb-3">
                      <div class="avatar-lg mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center"
                           [ngClass]="getStatusAvatarClass(application.status)">
                        <i class="fs-2" [ngClass]="getStatusIcon(application.status)"></i>
                      </div>
                      <h5 class="mb-1">{{ getStatusText(application.status) }}</h5>
                      <p class="text-muted mb-0">
                        Última actualización: {{ formatDate(application.updatedAt) }}
                      </p>
                    </div>

                    <!-- Quick Actions -->
                    <div class="d-grid gap-2" *ngIf="canPerformActions()">
                      <button 
                        class="btn btn-success btn-sm"
                        (click)="quickApprove()"
                        *ngIf="application.status === 'PENDIENTE' || application.status === 'EN_REVISION'"
                      >
                        <i class="bx bx-check me-1"></i> Aprobar
                      </button>
                      <button 
                        class="btn btn-danger btn-sm"
                        (click)="quickReject()"
                        *ngIf="application.status === 'PENDIENTE' || application.status === 'EN_REVISION'"
                      >
                        <i class="bx bx-x me-1"></i> Rechazar
                      </button>
                      <button 
                        class="btn btn-info btn-sm"
                        (click)="markAsReview()"
                        *ngIf="application.status !== 'EN_REVISION'"
                      >
                        <i class="bx bx-time me-1"></i> Marcar en Revisión
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Co-Debtors -->
              <div class="col-12" *ngIf="application.coDebtors && application.coDebtors.length > 0">
                <div class="card">
                  <div class="card-header">
                    <h5 class="card-title mb-0">
                      <i class="bx bx-group me-2"></i>Codeudores
                    </h5>
                  </div>
                  <div class="card-body">
                    <div class="table-responsive">
                      <table class="table table-hover">
                        <thead>
                          <tr>
                            <th>Nombre</th>
                            <th>Cédula</th>
                            <th>Teléfono</th>
                            <th>Relación</th>
                            <th>Ingresos Mensuales</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr *ngFor="let coDebtor of application.coDebtors">
                            <td>{{ coDebtor.firstName }} {{ coDebtor.lastName }}</td>
                            <td>{{ coDebtor.cedula }}</td>
                            <td>{{ coDebtor.phone || 'N/A' }}</td>
                            <td>{{ coDebtor.relationship || 'N/A' }}</td>
                            <td>{{ coDebtor.monthlyIncome ? formatCurrency(coDebtor.monthlyIncome) : 'N/A' }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <!-- References -->
              <div class="col-12" *ngIf="application.references && application.references.length > 0">
                <div class="card">
                  <div class="card-header">
                    <h5 class="card-title mb-0">
                      <i class="bx bx-phone me-2"></i>Referencias
                    </h5>
                  </div>
                  <div class="card-body">
                    <div class="table-responsive">
                      <table class="table table-hover">
                        <thead>
                          <tr>
                            <th>Nombre</th>
                            <th>Teléfono</th>
                            <th>Relación</th>
                            <th>Tipo</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr *ngFor="let reference of application.references">
                            <td>{{ reference.name }}</td>
                            <td>{{ reference.phone }}</td>
                            <td>{{ reference.relationship || 'N/A' }}</td>
                            <td>
                              <span class="badge" 
                                    [ngClass]="reference.isWorkReference ? 'bg-primary' : 'bg-secondary'">
                                {{ reference.isWorkReference ? 'Laboral' : 'Personal' }}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .avatar-md {
      width: 3rem;
      height: 3rem;
    }
    .avatar-lg {
      width: 4rem;
      height: 4rem;
    }
    .bg-primary-subtle {
      background-color: rgba(13, 110, 253, 0.1) !important;
    }
    .bg-success-subtle {
      background-color: rgba(25, 135, 84, 0.1) !important;
    }
    .bg-warning-subtle {
      background-color: rgba(255, 193, 7, 0.1) !important;
    }
    .bg-danger-subtle {
      background-color: rgba(220, 53, 69, 0.1) !important;
    }
    .bg-info-subtle {
      background-color: rgba(13, 202, 240, 0.1) !important;
    }
  `]
})
export class FinanceApplicationsViewComponent implements OnInit {
  application: FinanceApplication | null = null;
  loading = true;
  errorMessage: string | null = null;
  applicationId: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private applicationsService: FinanceApplicationsService
  ) {
    this.applicationId = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.loadApplication();
  }

  loadApplication() {
    this.loading = true;
    this.applicationsService.getWithDetails(this.applicationId).subscribe({
      next: (data) => {
        this.application = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading application:', error);
        this.errorMessage = 'Error al cargar la solicitud. Verifique que existe.';
        this.loading = false;
      }
    });
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  getStatusAvatarClass(status: ApplicationStatus): string {
    const classMap: Record<ApplicationStatus, string> = {
      [ApplicationStatus.PENDIENTE]: 'bg-warning-subtle',
      [ApplicationStatus.EN_REVISION]: 'bg-info-subtle',
      [ApplicationStatus.APROBADA]: 'bg-success-subtle',
      [ApplicationStatus.RECHAZADA]: 'bg-danger-subtle',
      [ApplicationStatus.DOCUMENTOS_PENDIENTES]: 'bg-secondary'
    };
    return classMap[status] || 'bg-secondary';
  }

  getStatusIcon(status: ApplicationStatus): string {
    const iconMap: Record<ApplicationStatus, string> = {
      [ApplicationStatus.PENDIENTE]: 'bx bx-time text-warning',
      [ApplicationStatus.EN_REVISION]: 'bx bx-search text-info',
      [ApplicationStatus.APROBADA]: 'bx bx-check-circle text-success',
      [ApplicationStatus.RECHAZADA]: 'bx bx-x-circle text-danger',
      [ApplicationStatus.DOCUMENTOS_PENDIENTES]: 'bx bx-file text-secondary'
    };
    return iconMap[status] || 'bx bx-help-circle text-secondary';
  }

  canEdit(): boolean {
    if (!this.application) return false;
    return this.application.status === ApplicationStatus.PENDIENTE || 
           this.application.status === ApplicationStatus.EN_REVISION;
  }

  canPerformActions(): boolean {
    // TODO: Implementar lógica de permisos (solo admin y financiera)
    return true;
  }

  quickApprove() {
    const monthlyPayment = prompt('Ingrese el pago mensual aprobado (opcional):');
    const payment = monthlyPayment ? parseFloat(monthlyPayment) : undefined;
    
    this.applicationsService.approve(this.applicationId, payment).subscribe({
      next: (updated) => {
        this.application = updated;
        // Show success message
      },
      error: (error) => {
        this.errorMessage = 'Error al aprobar la solicitud';
        console.error(error);
      }
    });
  }

  quickReject() {
    const reason = prompt('Ingrese la razón del rechazo:');
    if (!reason) return;
    
    this.applicationsService.reject(this.applicationId, reason).subscribe({
      next: (updated) => {
        this.application = updated;
        // Show success message
      },
      error: (error) => {
        this.errorMessage = 'Error al rechazar la solicitud';
        console.error(error);
      }
    });
  }

  markAsReview() {
    this.applicationsService.markAsReview(this.applicationId).subscribe({
      next: (updated) => {
        this.application = updated;
        // Show success message
      },
      error: (error) => {
        this.errorMessage = 'Error al actualizar la solicitud';
        console.error(error);
      }
    });
  }
}