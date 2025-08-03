import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FinanceApplicationsUpdateFormComponent } from '../../forms/applications/finance-applications-update-form.component';
import { FinanceApplicationsService } from '@core/services';
import { FinanceApplication } from '@core/models';

@Component({
  selector: 'app-finance-applications-update',
  standalone: true,
  imports: [CommonModule, RouterModule, FinanceApplicationsUpdateFormComponent],
  template: `
    <div class="container-xxl">
      <div class="row">
        <div class="col-12">
          <!-- Breadcrumb -->
          <div class="page-title-box d-sm-flex align-items-center justify-content-between">
            <h4 class="mb-sm-0">Editar Solicitud de Financiamiento</h4>
            <div class="page-title-right">
              <ol class="breadcrumb m-0">
                <li class="breadcrumb-item">
                  <a routerLink="/finance">Finanzas</a>
                </li>
                <li class="breadcrumb-item">
                  <a routerLink="/finance/applications">Solicitudes</a>
                </li>
                <li class="breadcrumb-item active">Editar</li>
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

          <!-- Form -->
          <div *ngIf="application && !loading" class="card">
            <div class="card-header">
              <div class="d-flex align-items-center">
                <div class="flex-shrink-0 me-3">
                  <div class="avatar-sm rounded-circle bg-warning-subtle d-flex align-items-center justify-content-center">
                    <i class="bx bx-edit text-warning fs-4"></i>
                  </div>
                </div>
                <div class="flex-grow-1">
                  <h5 class="card-title mb-1">Editar Solicitud #{{ application.id.substring(0, 8) }}</h5>
                  <p class="text-muted mb-0">Actualice los datos de la solicitud de financiamiento</p>
                </div>
              </div>
            </div>
            <div class="card-body">
              <app-finance-applications-update-form
                [application]="application"
                (applicationUpdated)="onApplicationUpdated($event)"
                (cancelled)="onCancel()"
              ></app-finance-applications-update-form>
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
    .bg-warning-subtle {
      background-color: rgba(255, 193, 7, 0.1) !important;
    }
  `]
})
export class FinanceApplicationsUpdateComponent implements OnInit {
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

  onApplicationUpdated(application: FinanceApplication) {
    // Navigate to view the updated application
    this.router.navigate(['/finance/applications', application.id, 'view'], {
      state: { message: 'Solicitud actualizada exitosamente' }
    });
  }

  onCancel() {
    this.router.navigate(['/finance/applications', this.applicationId, 'view']);
  }
}