import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FinanceCompaniesService } from '@core/services';
import { RegisterFinanceCompanyDto } from '@core/models';
import { FinanceCompaniesCreateFormComponent } from '../../forms/companies/finance-companies-create-form.component';

@Component({
  selector: 'app-finance-companies-create',
  standalone: true,
  imports: [CommonModule, RouterModule, FinanceCompaniesCreateFormComponent],
  template: `
    <div class="container-xxl">
      <div class="row">
        <div class="col-12">
          <!-- Breadcrumb -->
          <div class="row">
            <div class="col-12">
              <div class="page-title-box d-flex align-items-center justify-content-between">
                <h4 class="mb-0">Registrar Nueva Financiera</h4>
                <div class="page-title-right">
                  <ol class="breadcrumb m-0">
                    <li class="breadcrumb-item">
                      <a routerLink="/finance">Financieras</a>
                    </li>
                    <li class="breadcrumb-item active">Registrar</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <!-- Card Principal -->
          <div class="card">
            <div class="card-header">
              <div class="row align-items-center">
                <div class="col">
                  <h4 class="card-title">
                    <i class="iconamoon:certificate-badge-duotone me-2 text-primary"></i>
                    Nueva Financiera
                  </h4>
                  <p class="card-title-desc">
                    Complete la información para registrar una nueva empresa financiera
                  </p>
                </div>
                <div class="col-auto">
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

            <div class="card-body">
              <!-- Error Message -->
              <div *ngIf="error" class="alert alert-danger alert-dismissible fade show" role="alert">
                <i class="bx bx-error-circle me-2"></i>
                {{ error }}
                <button type="button" class="btn-close" (click)="error = null"></button>
              </div>

              <!-- Success Message -->
              <div *ngIf="success" class="alert alert-success alert-dismissible fade show" role="alert">
                <i class="bx bx-check-circle me-2"></i>
                {{ success }}
                <button type="button" class="btn-close" (click)="success = null"></button>
              </div>

              <!-- Información Importante -->
              <div class="alert alert-info border-info" role="alert">
                <div class="d-flex">
                  <div class="flex-shrink-0">
                    <i class="bx bx-info-circle fs-4"></i>
                  </div>
                  <div class="flex-grow-1 ms-3">
                    <h5 class="alert-heading">Información Importante</h5>
                    <p class="mb-2">
                      <strong>Al registrar una financiera:</strong>
                    </p>
                    <ul class="mb-0">
                      <li>Se creará un usuario con rol de "Financiera"</li>
                      <li>La empresa quedará activa automáticamente</li>
                      <li>Podrá gestionar sus propios datos una vez registrada</li>
                      <li>Tendrá acceso a aplicaciones de financiamiento</li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Formulario -->
              <app-finance-companies-create-form
                #financeFormRef
                [loading]="loading"
                (submitForm)="onCreateFinanceCompany($event)"
                (cancelForm)="onCancel()"
              ></app-finance-companies-create-form>
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
  `]
})
export class FinanceCompaniesCreateComponent {
  @ViewChild('financeFormRef') financeFormComponent!: FinanceCompaniesCreateFormComponent;

  loading = false;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private financeService: FinanceCompaniesService,
    private router: Router
  ) {}

  onCreateFinanceCompany(formData: RegisterFinanceCompanyDto) {
    this.error = null;
    this.success = null;
    this.loading = true;

    // Activar loading en el formulario
    this.financeFormComponent.setLoading(true);

    console.log('Datos a registrar:', formData);

    this.financeService.register(formData).subscribe({
      next: (result) => {
        this.loading = false;
        this.financeFormComponent.setLoading(false);
        
        this.success = `Financiera "${result.companyName}" registrada exitosamente`;
        
        // Redirigir después de un momento
        setTimeout(() => {
          this.router.navigate(['/finance'], { 
            state: { 
              message: `Financiera ${result.companyName} registrada exitosamente` 
            }
          });
        }, 2000);
      },
      error: (error) => {
        this.loading = false;
        this.financeFormComponent.setLoading(false);
        
        this.error = error.error?.message || 'Error al registrar la financiera. Intente nuevamente.';
        console.error('Error creating finance company:', error);
      }
    });
  }

  onCancel() {
    this.router.navigate(['/finance']);
  }
}