import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FinanceCompaniesService } from '@core/services';
import { FinanceCompany, UpdateFinanceCompanyDto } from '@core/models';
import { FinanceCompaniesUpdateFormComponent } from '../../forms/companies/finance-companies-update-form.component';

@Component({
  selector: 'app-finance-companies-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, FinanceCompaniesUpdateFormComponent],
  template: `
    <div class="container-xxl">
      <div class="row">
        <div class="col-12">
          <!-- Breadcrumb -->
          <div class="row">
            <div class="col-12">
              <div class="page-title-box d-flex align-items-center justify-content-between">
                <h4 class="mb-0">Editar Financiera</h4>
                <div class="page-title-right">
                  <ol class="breadcrumb m-0">
                    <li class="breadcrumb-item">
                      <a routerLink="/finance">Financieras</a>
                    </li>
                    <li class="breadcrumb-item">
                      <a [routerLink]="['/finance/companies', companyId, 'view']">
                        {{ company?.companyName || 'Financiera' }}
                      </a>
                    </li>
                    <li class="breadcrumb-item active">Editar</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <!-- Loading inicial -->
          <div *ngIf="loadingCompany" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando información de la financiera...</span>
            </div>
          </div>

          <!-- Error al cargar -->
          <div *ngIf="loadError" class="alert alert-danger" role="alert">
            <i class="bx bx-error-circle me-2"></i>
            {{ loadError }}
            <div class="mt-2">
              <button class="btn btn-outline-danger btn-sm" (click)="loadCompany()">
                <i class="bx bx-refresh me-1"></i> Reintentar
              </button>
              <button class="btn btn-light btn-sm ms-2" routerLink="/finance">
                <i class="bx bx-arrow-back me-1"></i> Volver al listado
              </button>
            </div>
          </div>

          <!-- Card Principal -->
          <div *ngIf="!loadingCompany && !loadError && company" class="card">
            <div class="card-header">
              <div class="row align-items-center">
                <div class="col">
                  <h4 class="card-title">
                    <i class="iconamoon:certificate-badge-duotone me-2 text-warning"></i>
                    Editar Financiera
                  </h4>
                  <p class="card-title-desc">
                    Actualice la información de <strong>{{ company.companyName }}</strong>
                  </p>
                </div>
                <div class="col-auto">
                  <div class="d-flex gap-2">
                    <button 
                      type="button" 
                      class="btn btn-soft-info" 
                      [routerLink]="['/finance/companies', company.id, 'view']"
                    >
                      <i class="bx bx-show me-1"></i> Ver Detalles
                    </button>
                    <button 
                      type="button" 
                      class="btn btn-soft-secondary" 
                      routerLink="/finance"
                    >
                      <i class="bx bx-arrow-back me-1"></i> Volver
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="card-body">
              <!-- Success Message -->
              <div *ngIf="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
                <i class="bx bx-check-circle me-2"></i>
                {{ successMessage }}
                <button type="button" class="btn-close" (click)="successMessage = null"></button>
              </div>

              <!-- Error Message -->
              <div *ngIf="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
                <i class="bx bx-error-circle me-2"></i>
                {{ errorMessage }}
                <button type="button" class="btn-close" (click)="errorMessage = null"></button>
              </div>

              <!-- Información Actual -->
              <div class="alert alert-info border-info mb-4" role="alert">
                <div class="d-flex">
                  <div class="flex-shrink-0">
                    <i class="bx bx-info-circle fs-4"></i>
                  </div>
                  <div class="flex-grow-1 ms-3">
                    <h6 class="alert-heading">Información Actual</h6>
                    <div class="row">
                      <div class="col-md-6">
                        <p class="mb-1">
                          <strong>Empresa:</strong> {{ company.companyName }}
                        </p>
                        <p class="mb-1">
                          <strong>RNC:</strong> <span class="font-family-code">{{ company.rnc }}</span>
                        </p>
                      </div>
                      <div class="col-md-6">
                        <p class="mb-1">
                          <strong>Tasa:</strong> {{ company.interestRate }}% anual
                        </p>
                        <p class="mb-1">
                          <strong>Plazo máximo:</strong> {{ company.maxFinanceMonths }} meses
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Formulario de Actualización -->
              <app-finance-companies-update-form
                #updateFormRef
                [company]="company"
                [loading]="updating"
                (submitForm)="onUpdateCompany($event)"
                (cancelForm)="onCancel()"
              ></app-finance-companies-update-form>
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
    .alert-heading {
      color: inherit;
      font-size: 1rem;
      font-weight: 600;
    }
    .page-title-box {
      padding-bottom: 1.5rem;
    }
    .font-family-code {
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
      font-size: 0.875rem;
    }
  `]
})
export class FinanceCompaniesUpdateComponent implements OnInit {
  @ViewChild('updateFormRef') updateFormComponent!: FinanceCompaniesUpdateFormComponent;

  company: FinanceCompany | null = null;
  companyId: string;
  loadingCompany = true;
  updating = false;
  loadError: string | null = null;
  successMessage: string | null = null;
  errorMessage: string | null = null;

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
    this.loadingCompany = true;
    this.loadError = null;

    this.financeService.getById(this.companyId).subscribe({
      next: (data) => {
        this.company = data;
        this.loadingCompany = false;
      },
      error: (error) => {
        console.error('Error loading company:', error);
        this.loadError = error.error?.message || 'Error al cargar la información de la financiera';
        this.loadingCompany = false;
      }
    });
  }

  onUpdateCompany(formData: UpdateFinanceCompanyDto) {
    if (!this.company) return;

    this.errorMessage = null;
    this.successMessage = null;
    this.updating = true;

    // Activar loading en el formulario
    this.updateFormComponent.setLoading(true);

    console.log('Datos a actualizar:', formData);

    this.financeService.update(this.company.id, formData).subscribe({
      next: (updatedCompany) => {
        this.updating = false;
        this.updateFormComponent.setLoading(false);
        
        // Actualizar los datos locales
        this.company = updatedCompany;
        
        this.successMessage = `Financiera "${updatedCompany.companyName}" actualizada exitosamente`;
        
        // Scroll hacia arriba para mostrar el mensaje
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Opcional: Redirigir después de un momento
        setTimeout(() => {
          this.router.navigate(['/finance/companies', this.company!.id, 'view'], {
            state: { 
              message: `Financiera ${this.company!.companyName} actualizada exitosamente` 
            }
          });
        }, 2000);
      },
      error: (error) => {
        this.updating = false;
        this.updateFormComponent.setLoading(false);
        
        this.errorMessage = error.error?.message || 'Error al actualizar la financiera. Intente nuevamente.';
        console.error('Error updating company:', error);
        
        // Scroll hacia arriba para mostrar el error
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  onCancel() {
    // Verificar si hay cambios pendientes
    if (this.updateFormComponent && this.updateFormComponent.hasChanges()) {
      const confirmLeave = confirm('¿Está seguro de que desea cancelar? Se perderán los cambios no guardados.');
      if (!confirmLeave) {
        return;
      }
    }

    // Navegar de vuelta a la vista de detalles
    this.router.navigate(['/finance/companies', this.companyId, 'view']);
  }
}