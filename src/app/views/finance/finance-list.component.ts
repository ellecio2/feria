import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FinanceCompaniesService } from '@core/services';
import { FinanceCompany } from '@core/models';
import { FinanceCompaniesDeleteModalComponent } from './core/modals/finance-companies-delete-modal.component';

@Component({
  selector: 'app-finance-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FinanceCompaniesDeleteModalComponent],
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
                    <i class="iconamoon:certificate-badge-duotone me-2 text-primary"></i>
                    Financieras Registradas
                  </h4>
                  <p class="card-title-desc mb-0">Gestione las empresas financieras asociadas</p>
                </div>
                <div class="col-auto">
                  <div class="d-flex gap-2">
                    <button class="btn btn-info" routerLink="/finance/applications">
                      <i class="bx bx-file-blank me-1"></i> Solicitudes
                    </button>
                    <button class="btn btn-info" routerLink="/finance/calculator">
                      <i class="bx bx-calculator me-1"></i> Calculadora
                    </button>
                    <button class="btn btn-success" (click)="registerFinanceCompany()">
                      <i class="bx bx-plus me-1"></i> Registrar Financiera
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-body">
              <!-- Loading -->
              <div *ngIf="loading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Cargando financieras...</span>
                </div>
              </div>

              <!-- Table -->
              <div *ngIf="!loading" class="table-responsive">
                <table class="table table-hover" *ngIf="companies.length > 0">
                  <thead>
                    <tr>
                      <th>Empresa</th>
                      <th>RNC</th>
                      <th>Tasa de Interés</th>
                      <th>Plazo Máximo</th>
                      <th>Estado</th>
                      <th class="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let company of companies">
                      <td>
                        <div class="d-flex align-items-center">
                          <div class="avatar-sm rounded-circle bg-light d-flex align-items-center justify-content-center me-3">
                            <i class="iconamoon:certificate-badge-duotone text-primary fs-4"></i>
                          </div>
                          <div>
                            <h6 class="mb-0">{{ company.companyName }}</h6>
                            <small class="text-muted" *ngIf="company.user">
                              {{ company.user.firstName }} {{ company.user.lastName }}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span class="font-family-code">{{ company.rnc }}</span>
                      </td>
                      <td>
                        <span class="badge bg-info-subtle text-info">
                          {{ company.interestRate }}% anual
                        </span>
                      </td>
                      <td>
                        <span class="text-muted">{{ company.maxFinanceMonths }} meses</span>
                      </td>
                      <td>
                        <span class="badge" [ngClass]="getStatusClass(company.isActive)">
                          {{ company.isActive ? 'Activa' : 'Inactiva' }}
                        </span>
                      </td>
                      <td class="text-center">
                        <div class="btn-group" role="group">
                          <button 
                            class="btn btn-sm btn-soft-info"
                            [routerLink]="['/finance/companies', company.id, 'view']"
                            title="Ver detalles"
                          >
                            <i class="bx bx-show"></i>
                          </button>
                          <button 
                            class="btn btn-sm btn-soft-success"
                            (click)="calculateWithCompany(company)"
                            title="Calcular financiamiento"
                          >
                            <i class="bx bx-calculator"></i>
                          </button>
                          <button 
                            class="btn btn-sm btn-soft-warning"
                            (click)="editCompany(company)"
                            title="Editar"
                            *ngIf="canEdit(company)"
                          >
                            <i class="bx bx-edit"></i>
                          </button>
                          <button 
                            class="btn btn-sm btn-soft-danger"
                            (click)="confirmDelete(company)"
                            title="Eliminar"
                            [disabled]="deleting"
                            *ngIf="canDelete()"
                          >
                            <i class="bx bx-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <!-- Empty State -->
                <div *ngIf="companies.length === 0" class="text-center py-5">
                  <div class="mb-3">
                    <i class="iconamoon:certificate-badge-duotone display-4 text-muted"></i>
                  </div>
                  <h5 class="text-muted">No hay financieras registradas</h5>
                  <p class="text-muted mb-3">Comience registrando la primera empresa financiera</p>
                  <button class="btn btn-primary" (click)="registerFinanceCompany()">
                    <i class="bx bx-plus me-1"></i> Registrar Primera Financiera
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="row mt-4" *ngIf="!loading && companies.length > 0">
      <div class="col-md-3">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="avatar-md rounded-circle bg-primary-subtle d-flex align-items-center justify-content-center me-3">
                <i class="iconamoon:certificate-badge-duotone text-primary fs-3"></i>
              </div>
              <div>
                <h4 class="mb-0">{{ companies.length }}</h4>
                <p class="text-muted mb-0">Total Financieras</p>
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
                <h4 class="mb-0">{{ getActiveCompanies() }}</h4>
                <p class="text-muted mb-0">Activas</p>
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
                <i class="bx bx-percentage text-info fs-3"></i>
              </div>
              <div>
                <h4 class="mb-0">{{ getAverageRate() }}%</h4>
                <p class="text-muted mb-0">Tasa Promedio</p>
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
                <h4 class="mb-0">{{ getMaxTerm() }}</h4>
                <p class="text-muted mb-0">Plazo Máximo</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Agregar al final del template -->
    <app-finance-companies-delete-modal
      #deleteModal
      [company]="companyToDelete"
      [deleting]="deleting"
      [errorMessage]="deleteErrorMessage"
      (confirmDeleteEvent)="deleteCompany()"
      (modalClosedEvent)="onModalClosed()"
    ></app-finance-companies-delete-modal>
  `,
  styles: [`
    .card-title-desc {
      color: #6c757d;
    }
    .font-family-code {
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
      font-size: 0.875rem;
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
export class FinanceListComponent implements OnInit {
  @ViewChild('deleteModal') deleteModal!: FinanceCompaniesDeleteModalComponent;

  companies: FinanceCompany[] = [];
  loading = true;
  deleting = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  companyToDelete: FinanceCompany | null = null;
  deleteErrorMessage: string | null = null;

  constructor(
    private financeService: FinanceCompaniesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCompanies();
    this.checkForMessages();
  }

  checkForMessages() {
    const navigation = history.state;
    if (navigation?.message) {
      this.successMessage = navigation.message;
      history.replaceState({}, '', location.pathname);
    }
  }

  loadCompanies() {
    this.loading = true;
    this.financeService.getAll().subscribe({
      next: (data) => {
        this.companies = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading finance companies:', error);
        this.errorMessage = 'Error al cargar las financieras. Intente nuevamente.';
        this.loading = false;
      }
    });
  }

  getStatusClass(isActive: boolean): string {
    return isActive ? 'bg-success' : 'bg-secondary';
  }

  getActiveCompanies(): number {
    return this.companies.filter(c => c.isActive).length;
  }

  getAverageRate(): string {
    if (this.companies.length === 0) return '0.0';
    const total = this.companies.reduce((sum, c) => sum + c.interestRate, 0);
    return (total / this.companies.length).toFixed(1);
  }

  getMaxTerm(): string {
    if (this.companies.length === 0) return '0';
    const max = Math.max(...this.companies.map(c => c.maxFinanceMonths));
    return `${max} meses`;
  }

  registerFinanceCompany() {
    this.router.navigate(['/finance/companies/create']);
  }

  calculateWithCompany(company: FinanceCompany) {
    // TODO: Navegar a calculadora con datos pre-llenados
    console.log('Calcular con:', company);
  }

  editCompany(company: FinanceCompany) {
    this.router.navigate(['/finance/companies', company.id, 'edit']);
  }

  confirmDelete(company: FinanceCompany) {
    this.companyToDelete = company;
    this.deleteErrorMessage = null;
    this.deleteModal.showModal();
  }

  deleteCompany() {
    if (!this.companyToDelete) return;

    this.deleting = true;
    this.deleteErrorMessage = null;

    this.financeService.delete(this.companyToDelete.id).subscribe({
      next: () => {
        this.deleting = false;
        this.deleteModal.hideModal();
        
        this.successMessage = `Financiera "${this.companyToDelete!.companyName}" eliminada exitosamente`;
        
        // Remover de la lista local
        this.companies = this.companies.filter(c => c.id !== this.companyToDelete!.id);
        this.companyToDelete = null;
      },
      error: (error) => {
        this.deleting = false;
        console.error('Error deleting company:', error);
        this.deleteErrorMessage = error.error?.message || 'Error al eliminar la financiera';
      }
    });
  }

  onModalClosed() {
    this.companyToDelete = null;
    this.deleteErrorMessage = null;
  }

  canEdit(company: FinanceCompany): boolean {
    // TODO: Implementar lógica de permisos
    return true;
  }

  canDelete(): boolean {
    // TODO: Implementar lógica de permisos (solo admin)
    return true;
  }
}