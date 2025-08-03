import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FinanceCompaniesService } from '@core/services';
import { FinanceCompany } from '@core/models';

@Component({
  selector: 'app-finance-companies-view',
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
                <h4 class="mb-0">Detalles de Financiera</h4>
                <div class="page-title-right">
                  <ol class="breadcrumb m-0">
                    <li class="breadcrumb-item">
                      <a routerLink="/finance">Financieras</a>
                    </li>
                    <li class="breadcrumb-item active">{{ company?.companyName || 'Detalles' }}</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <!-- Loading -->
          <div *ngIf="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando información...</span>
            </div>
          </div>

          <!-- Error -->
          <div *ngIf="error" class="alert alert-danger" role="alert">
            <i class="bx bx-error-circle me-2"></i>
            {{ error }}
            <div class="mt-2">
              <button class="btn btn-outline-danger btn-sm" (click)="loadCompany()">
                <i class="bx bx-refresh me-1"></i> Reintentar
              </button>
              <button class="btn btn-light btn-sm ms-2" routerLink="/finance">
                <i class="bx bx-arrow-back me-1"></i> Volver
              </button>
            </div>
          </div>

          <!-- Content -->
          <div *ngIf="!loading && !error && company">
            <!-- Header Card -->
            <div class="card">
              <div class="card-body">
                <div class="row align-items-center">
                  <div class="col">
                    <div class="d-flex align-items-center">
                      <div class="avatar-lg rounded-circle bg-primary-subtle d-flex align-items-center justify-content-center me-3">
                        <i class="iconamoon:certificate-badge-duotone text-primary fs-1"></i>
                      </div>
                      <div>
                        <h4 class="mb-1">{{ company.companyName }}</h4>
                        <p class="text-muted mb-0">
                          <span class="badge" [ngClass]="getStatusClass(company.isActive)">
                            {{ company.isActive ? 'Activa' : 'Inactiva' }}
                          </span>
                          <span class="ms-2">RNC: {{ company.rnc }}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="col-auto">
                    <div class="d-flex gap-2">
                      <button 
                        class="btn btn-soft-success"
                        (click)="calculateFinancing()"
                        title="Calcular financiamiento"
                      >
                        <i class="bx bx-calculator me-1"></i> Calculadora
                      </button>
                      <button 
                        class="btn btn-soft-warning"
                        [routerLink]="['/finance/companies', company.id, 'edit']"
                        *ngIf="canEdit()"
                      >
                        <i class="bx bx-edit me-1"></i> Editar
                      </button>
                      <button 
                        class="btn btn-soft-secondary" 
                        routerLink="/finance"
                      >
                        <i class="bx bx-arrow-back me-1"></i> Volver
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Details -->
            <div class="row mt-4">
              <!-- Información de la Financiera -->
              <div class="col-lg-8">
                <div class="card">
                  <div class="card-header">
                    <h5 class="card-title mb-0">
                      <i class="iconamoon:certificate-badge-duotone me-2 text-primary"></i>
                      Información de la Financiera
                    </h5>
                  </div>
                  <div class="card-body">
                    <div class="row">
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label class="form-label text-muted">Nombre de la Empresa</label>
                          <p class="fw-medium">{{ company.companyName }}</p>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label class="form-label text-muted">RNC</label>
                          <p class="fw-medium font-family-code">{{ company.rnc }}</p>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label class="form-label text-muted">Tasa de Interés</label>
                          <p class="fw-medium">
                            <span class="badge bg-info-subtle text-info fs-6">
                              {{ company.interestRate }}% anual
                            </span>
                          </p>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label class="form-label text-muted">Plazo Máximo</label>
                          <p class="fw-medium">{{ company.maxFinanceMonths }} meses</p>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label class="form-label text-muted">Estado</label>
                          <p class="fw-medium">
                            <span class="badge" [ngClass]="getStatusClass(company.isActive)">
                              {{ company.isActive ? 'Activa' : 'Inactiva' }}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label class="form-label text-muted">Fecha de Registro</label>
                          <p class="fw-medium">{{ company.createdAt | date:'dd/MM/yyyy HH:mm' }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Información del Usuario -->
              <div class="col-lg-4">
                <div class="card">
                  <div class="card-header">
                    <h5 class="card-title mb-0">
                      <i class="bx bx-user me-2 text-success"></i>
                      Usuario Asociado
                    </h5>
                  </div>
                  <div class="card-body" *ngIf="company.user">
                    <div class="text-center mb-3">
                      <div class="avatar-lg mx-auto rounded-circle bg-success-subtle d-flex align-items-center justify-content-center">
                        <i class="bx bx-user text-success fs-1"></i>
                      </div>
                    </div>
                    <div class="text-center">
                      <h6 class="mb-1">{{ company.user.firstName }} {{ company.user.lastName }}</h6>
                      <p class="text-muted mb-2">{{ company.user.email }}</p>
                      <p class="text-muted mb-0" *ngIf="company.user.phone">
                        <i class="bx bx-phone me-1"></i>{{ company.user.phone }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Stats Card -->
                <div class="card mt-4">
                  <div class="card-header">
                    <h5 class="card-title mb-0">
                      <i class="bx bx-bar-chart me-2 text-info"></i>
                      Estadísticas
                    </h5>
                  </div>
                  <div class="card-body">
                    <div class="mb-3">
                      <div class="d-flex justify-content-between">
                        <span class="text-muted">Cuota mensual estimada</span>
                        <span class="fw-medium">{{ getEstimatedPayment() | currency:'DOP' }}</span>
                      </div>
                      <small class="text-muted">Basado en RD$1,000,000 a {{ company.maxFinanceMonths }} meses</small>
                    </div>
                    <div class="mb-3">
                      <div class="d-flex justify-content-between">
                        <span class="text-muted">Total a pagar</span>
                        <span class="fw-medium">{{ getTotalPayment() | currency:'DOP' }}</span>
                      </div>
                    </div>
                    <div>
                      <div class="d-flex justify-content-between">
                        <span class="text-muted">Intereses totales</span>
                        <span class="fw-medium text-warning">{{ getTotalInterest() | currency:'DOP' }}</span>
                      </div>
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
    .card-title {
      color: #495057;
      font-weight: 600;
    }
    .font-family-code {
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
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
    .bg-info-subtle {
      background-color: rgba(13, 202, 240, 0.1) !important;
    }
    .fs-1 {
      font-size: 2.5rem !important;
    }
    .page-title-box {
      padding-bottom: 1.5rem;
    }
  `]
})
export class FinanceCompaniesViewComponent implements OnInit {
  company: FinanceCompany | null = null;
  loading = true;
  error: string | null = null;
  companyId: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private financeService: FinanceCompaniesService
  ) {
    this.companyId = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.loadCompany();
  }

  loadCompany() {
    this.loading = true;
    this.error = null;

    this.financeService.getById(this.companyId).subscribe({
      next: (data) => {
        this.company = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading company:', error);
        this.error = 'Error al cargar la información de la financiera';
        this.loading = false;
      }
    });
  }

  getStatusClass(isActive: boolean): string {
    return isActive ? 'bg-success' : 'bg-secondary';
  }

  canEdit(): boolean {
    // TODO: Implementar lógica de permisos
    return true;
  }

  calculateFinancing() {
    // TODO: Navegar a calculadora con datos de la financiera
    this.router.navigate(['/finance/calculator'], {
      queryParams: {
        companyId: this.company?.id,
        interestRate: this.company?.interestRate,
        maxMonths: this.company?.maxFinanceMonths
      }
    });
  }

  getEstimatedPayment(): number {
    if (!this.company) return 0;
    
    const principal = 1000000; // RD$1,000,000 como ejemplo
    const monthlyRate = this.company.interestRate / 100 / 12;
    const months = this.company.maxFinanceMonths;
    
    if (monthlyRate === 0) return principal / months;
    
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
           (Math.pow(1 + monthlyRate, months) - 1);
  }

  getTotalPayment(): number {
    return this.getEstimatedPayment() * (this.company?.maxFinanceMonths || 0);
  }

  getTotalInterest(): number {
    return this.getTotalPayment() - 1000000;
  }
}