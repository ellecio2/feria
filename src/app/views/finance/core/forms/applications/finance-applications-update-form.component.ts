import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FinanceApplicationsService } from '@core/services';
import { FinanceApplication, UpdateFinanceApplicationDto, ApplicationStatus } from '@core/models';

@Component({
  selector: 'app-finance-applications-update-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="updateForm" (ngSubmit)="onSubmit()">
      <!-- Status Update Section -->
      <div class="row mb-4">
        <div class="col-12">
          <h6 class="fw-semibold text-muted text-uppercase mb-3">
            <i class="bx bx-edit me-2"></i>Actualización de Estado
          </h6>
        </div>
        <div class="col-md-6">
          <label for="status" class="form-label">Estado</label>
          <select 
            class="form-select" 
            id="status" 
            formControlName="status"
          >
            <option value="">Mantener estado actual</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="EN_REVISION">En Revisión</option>
            <option value="APROBADA">Aprobada</option>
            <option value="RECHAZADA">Rechazada</option>
            <option value="DOCUMENTOS_PENDIENTES">Documentos Pendientes</option>
          </select>
        </div>
        <div class="col-md-6" *ngIf="updateForm.get('status')?.value === 'APROBADA'">
          <label for="monthlyPayment" class="form-label">Pago Mensual Aprobado</label>
          <div class="input-group">
            <span class="input-group-text">RD$</span>
            <input 
              type="number" 
              class="form-control" 
              id="monthlyPayment" 
              formControlName="monthlyPayment"
              placeholder="0.00"
            >
          </div>
        </div>
      </div>

      <!-- Rejection Reason -->
      <div class="row mb-4" *ngIf="updateForm.get('status')?.value === 'RECHAZADA' || updateForm.get('status')?.value === 'DOCUMENTOS_PENDIENTES'">
        <div class="col-12">
          <label for="rejectionReason" class="form-label">
            {{ updateForm.get('status')?.value === 'RECHAZADA' ? 'Razón del Rechazo' : 'Documentos Pendientes' }}
            <span class="text-danger">*</span>
          </label>
          <textarea 
            class="form-control" 
            id="rejectionReason" 
            formControlName="rejectionReason"
            rows="3"
            [placeholder]="updateForm.get('status')?.value === 'RECHAZADA' ? 'Explique la razón del rechazo...' : 'Especifique qué documentos faltan...'"
            [class.is-invalid]="updateForm.get('rejectionReason')?.invalid && updateForm.get('rejectionReason')?.touched"
          ></textarea>
          <div class="invalid-feedback" *ngIf="updateForm.get('rejectionReason')?.invalid && updateForm.get('rejectionReason')?.touched">
            <div *ngIf="updateForm.get('rejectionReason')?.errors?.['required']">
              Este campo es requerido cuando se rechaza o se solicitan documentos
            </div>
          </div>
        </div>
      </div>

      <!-- Current Application Info (Read-only) -->
      <div class="row mb-4">
        <div class="col-12">
          <h6 class="fw-semibold text-muted text-uppercase mb-3">
            <i class="bx bx-info-circle me-2"></i>Información Actual
          </h6>
        </div>
        <div class="col-md-6">
          <div class="card bg-light">
            <div class="card-body">
              <h6 class="card-title">Detalles del Financiamiento</h6>
              <div class="table-responsive">
                <table class="table table-borderless table-sm mb-0">
                  <tbody>
                    <tr>
                      <td class="fw-semibold">Cliente:</td>
                      <td>
                        <span *ngIf="application.client">
                          {{ application.client.firstName }} {{ application.client.lastName }}
                        </span>
                        <span *ngIf="!application.client" class="text-muted">
                          ID: {{ application.clientId }}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td class="fw-semibold">Vehículo:</td>
                      <td>
                        <span *ngIf="application.vehicle">
                          {{ application.vehicle.brand }} {{ application.vehicle.model }} {{ application.vehicle.year }}
                        </span>
                        <span *ngIf="!application.vehicle" class="text-muted">
                          ID: {{ application.vehicleId }}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td class="fw-semibold">Monto Solicitado:</td>
                      <td class="text-success fw-bold">{{ formatCurrency(application.requestedAmount) }}</td>
                    </tr>
                    <tr>
                      <td class="fw-semibold">Pago Inicial:</td>
                      <td>{{ formatCurrency(application.downPayment) }}</td>
                    </tr>
                    <tr>
                      <td class="fw-semibold">Plazo:</td>
                      <td>{{ application.financeMonths }} meses</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card bg-light">
            <div class="card-body">
              <h6 class="card-title">Estado Actual</h6>
              <div class="d-flex align-items-center mb-3">
                <span class="badge fs-6 me-2" [ngClass]="getStatusBadgeClass(application.status)">
                  {{ getStatusText(application.status) }}
                </span>
              </div>
              <div class="table-responsive">
                <table class="table table-borderless table-sm mb-0">
                  <tbody>
                    <tr>
                      <td class="fw-semibold">Financiera:</td>
                      <td>
                        <span *ngIf="application.financeCompany">
                          {{ application.financeCompany.companyName }}
                        </span>
                        <span *ngIf="!application.financeCompany" class="text-muted">
                          ID: {{ application.financeCompanyId }}
                        </span>
                      </td>
                    </tr>
                    <tr *ngIf="application.monthlyPayment">
                      <td class="fw-semibold">Pago Mensual:</td>
                      <td class="text-info fw-bold">{{ formatCurrency(application.monthlyPayment) }}</td>
                    </tr>
                    <tr *ngIf="application.rejectionReason">
                      <td class="fw-semibold">Razón:</td>
                      <td class="text-danger">{{ application.rejectionReason }}</td>
                    </tr>
                    <tr>
                      <td class="fw-semibold">Creada:</td>
                      <td>{{ formatDate(application.createdAt) }}</td>
                    </tr>
                    <tr>
                      <td class="fw-semibold">Actualizada:</td>
                      <td>{{ formatDate(application.updatedAt) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="row">
        <div class="col-12">
          <div class="d-flex gap-2 justify-content-end">
            <button 
              type="button" 
              class="btn btn-outline-secondary"
              (click)="onCancel()"
              [disabled]="submitting"
            >
              <i class="bx bx-x me-1"></i> Cancelar
            </button>
            <button 
              type="submit" 
              class="btn btn-primary"
              [disabled]="updateForm.invalid || submitting || !hasChanges()"
            >
              <span *ngIf="submitting" class="spinner-border spinner-border-sm me-2"></span>
              <i *ngIf="!submitting" class="bx bx-check me-1"></i>
              {{ submitting ? 'Actualizando...' : 'Actualizar Solicitud' }}
            </button>
          </div>
          <div class="text-muted mt-2" *ngIf="!hasChanges()">
            <small>
              <i class="bx bx-info-circle me-1"></i>
              Realice cambios para habilitar la actualización
            </small>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div *ngIf="errorMessage" class="alert alert-danger mt-3" role="alert">
        {{ errorMessage }}
      </div>

      <!-- Success Message -->
      <div *ngIf="successMessage" class="alert alert-success mt-3" role="alert">
        {{ successMessage }}
      </div>
    </form>
  `,
  styles: [`
    .card {
      border: 1px solid #e9ecef;
    }
    .form-label {
      font-weight: 500;
      margin-bottom: 0.5rem;
    }
    .text-uppercase {
      letter-spacing: 0.05em;
    }
    .bg-light {
      background-color: #f8f9fa !important;
    }
  `]
})
export class FinanceApplicationsUpdateFormComponent implements OnInit {
  @Input() application!: FinanceApplication;
  @Output() applicationUpdated = new EventEmitter<FinanceApplication>();
  @Output() cancelled = new EventEmitter<void>();

  updateForm: FormGroup;
  submitting = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private applicationsService: FinanceApplicationsService
  ) {
    this.updateForm = this.createForm();
  }

  ngOnInit() {
    if (this.application) {
      this.setupForm();
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      status: [''],
      monthlyPayment: [0],
      rejectionReason: ['']
    });
  }

  setupForm() {
    // Set up validation based on status changes
    this.updateForm.get('status')?.valueChanges.subscribe(status => {
      const rejectionReasonControl = this.updateForm.get('rejectionReason');
      
      if (status === 'RECHAZADA' || status === 'DOCUMENTOS_PENDIENTES') {
        rejectionReasonControl?.setValidators([Validators.required]);
      } else {
        rejectionReasonControl?.clearValidators();
      }
      
      rejectionReasonControl?.updateValueAndValidity();
    });
  }

  hasChanges(): boolean {
    const formValue = this.updateForm.value;
    return !!(formValue.status || formValue.monthlyPayment || formValue.rejectionReason);
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

  onSubmit() {
    if (this.updateForm.invalid || !this.hasChanges()) {
      this.updateForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.errorMessage = null;
    this.successMessage = null;

    const formValue = this.updateForm.value;
    const updateDto: UpdateFinanceApplicationDto = {};

    // Only include changed values
    if (formValue.status) {
      updateDto.status = formValue.status as ApplicationStatus;
    }
    
    if (formValue.monthlyPayment) {
      updateDto.monthlyPayment = formValue.monthlyPayment;
    }
    
    if (formValue.rejectionReason) {
      updateDto.rejectionReason = formValue.rejectionReason;
    }

    this.applicationsService.update(this.application.id, updateDto).subscribe({
      next: (response) => {
        this.submitting = false;
        this.successMessage = 'Solicitud actualizada exitosamente';
        
        // Reset form
        this.updateForm.reset();
        
        // Emit the updated application
        setTimeout(() => {
          this.applicationUpdated.emit(response);
        }, 1500);
      },
      error: (error) => {
        this.submitting = false;
        this.errorMessage = error.error?.message || 'Error al actualizar la solicitud. Intente nuevamente.';
        console.error('Error updating application:', error);
      }
    });
  }

  onCancel() {
    this.cancelled.emit();
  }
}