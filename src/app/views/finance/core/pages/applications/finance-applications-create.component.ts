import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FinanceApplicationsCreateFormComponent } from '../../forms/applications/finance-applications-create-form.component';

@Component({
  selector: 'app-finance-applications-create',
  standalone: true,
  imports: [CommonModule, RouterModule, FinanceApplicationsCreateFormComponent],
  template: `
    <div class="container-xxl">
      <div class="row">
        <div class="col-12">
          <!-- Breadcrumb -->
          <div class="page-title-box d-sm-flex align-items-center justify-content-between">
            <h4 class="mb-sm-0">Nueva Solicitud de Financiamiento</h4>
            <div class="page-title-right">
              <ol class="breadcrumb m-0">
                <li class="breadcrumb-item">
                  <a routerLink="/finance">Finanzas</a>
                </li>
                <li class="breadcrumb-item">
                  <a routerLink="/finance/applications">Solicitudes</a>
                </li>
                <li class="breadcrumb-item active">Nueva Solicitud</li>
              </ol>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <div class="d-flex align-items-center">
                <div class="flex-shrink-0 me-3">
                  <div class="avatar-sm rounded-circle bg-primary-subtle d-flex align-items-center justify-content-center">
                    <i class="bx bx-plus text-primary fs-4"></i>
                  </div>
                </div>
                <div class="flex-grow-1">
                  <h5 class="card-title mb-1">Crear Solicitud de Financiamiento</h5>
                  <p class="text-muted mb-0">Complete los datos para crear una nueva solicitud de crédito vehicular</p>
                </div>
              </div>
            </div>
            <div class="card-body">
              <app-finance-applications-create-form
                (applicationCreated)="onApplicationCreated($event)"
                (cancelled)="onCancel()"
              ></app-finance-applications-create-form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .avatar-sm {
      width: 2.5rem;
      height: 2.5rem;
    }
    .bg-primary-subtle {
      background-color: rgba(13, 110, 253, 0.1) !important;
    }
  `]
})
export class FinanceApplicationsCreateComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
    // Initialization logic if needed
  }

  onApplicationCreated(application: any) {
    // Navigate to view the created application
    this.router.navigate(['/finance/applications', application.id, 'view'], {
      state: { message: 'Solicitud de financiamiento creada exitosamente' }
    });
  }

  onCancel() {
    this.router.navigate(['/finance/applications']);
  }
}