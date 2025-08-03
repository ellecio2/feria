import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FinanceCompany, UpdateFinanceCompanyDto } from '@core/models';

@Component({
  selector: 'app-finance-companies-update-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="updateForm" (ngSubmit)="onSubmit()">
      <!-- Información de la Financiera -->
      <div class="row">
        <div class="col-12">
          <div class="mb-4">
            <h5 class="text-primary mb-3">
              <i class="iconamoon:certificate-badge-duotone me-2"></i>
              Información de la Financiera
            </h5>
            <div class="border rounded p-3 bg-light">
              <div class="row">
                <div class="col-md-8">
                  <div class="mb-3">
                    <label for="companyName" class="form-label">
                      Nombre de la Empresa <span class="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="companyName"
                      formControlName="companyName"
                      placeholder="Ej: Banco Popular Dominicano"
                      [class.is-invalid]="isFieldInvalid('companyName')"
                    />
                    <div class="invalid-feedback" *ngIf="isFieldInvalid('companyName')">
                      <div *ngIf="updateForm.get('companyName')?.errors?.['required']">
                        El nombre de la empresa es requerido
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="mb-3">
                    <label for="rnc" class="form-label">RNC</label>
                    <input
                      type="text"
                      class="form-control"
                      id="rnc"
                      [value]="company?.rnc"
                      readonly
                      class="form-control-plaintext"
                    />
                    <div class="form-text">El RNC no se puede modificar</div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="interestRate" class="form-label">
                      Tasa de Interés Anual (%)
                    </label>
                    <div class="input-group">
                      <input
                        type="number"
                        class="form-control"
                        id="interestRate"
                        formControlName="interestRate"
                        placeholder="12.5"
                        min="0"
                        max="100"
                        step="0.1"
                        [class.is-invalid]="isFieldInvalid('interestRate')"
                      />
                      <span class="input-group-text">%</span>
                    </div>
                    <div class="form-text">Tasa de interés anual que ofrece la financiera</div>
                    <div class="invalid-feedback" *ngIf="isFieldInvalid('interestRate')">
                      <div *ngIf="updateForm.get('interestRate')?.errors?.['min']">
                        La tasa no puede ser negativa
                      </div>
                      <div *ngIf="updateForm.get('interestRate')?.errors?.['max']">
                        La tasa no puede ser mayor a 100%
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="maxFinanceMonths" class="form-label">
                      Plazo Máximo de Financiamiento
                    </label>
                    <div class="input-group">
                      <input
                        type="number"
                        class="form-control"
                        id="maxFinanceMonths"
                        formControlName="maxFinanceMonths"
                        placeholder="84"
                        min="1"
                        max="120"
                        [class.is-invalid]="isFieldInvalid('maxFinanceMonths')"
                      />
                      <span class="input-group-text">meses</span>
                    </div>
                    <div class="form-text">Máximo número de meses para financiamiento</div>
                    <div class="invalid-feedback" *ngIf="isFieldInvalid('maxFinanceMonths')">
                      <div *ngIf="updateForm.get('maxFinanceMonths')?.errors?.['min']">
                        El plazo mínimo es 1 mes
                      </div>
                      <div *ngIf="updateForm.get('maxFinanceMonths')?.errors?.['max']">
                        El plazo máximo es 120 meses
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Información Adicional -->
      <div class="row">
        <div class="col-12">
          <div class="alert alert-info border-info" role="alert">
            <div class="d-flex">
              <div class="flex-shrink-0">
                <i class="bx bx-info-circle fs-4"></i>
              </div>
              <div class="flex-grow-1 ms-3">
                <h6 class="alert-heading">Información</h6>
                <p class="mb-0">
                  Los datos del usuario asociado (email, nombre, teléfono) se pueden actualizar desde el perfil del usuario.
                  Aquí solo se pueden modificar los datos específicos de la financiera.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Botones de Acción -->
      <div class="row">
        <div class="col-12">
          <div class="d-flex justify-content-end gap-2">
            <button
              type="button"
              class="btn btn-light"
              (click)="onCancel()"
              [disabled]="loading"
            >
              <i class="bx bx-x me-1"></i>
              Cancelar
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="updateForm.invalid || loading || !hasChanges()"
            >
              <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
              <i *ngIf="!loading" class="bx bx-save me-1"></i>
              {{ loading ? 'Actualizando...' : 'Actualizar Financiera' }}
            </button>
          </div>
        </div>
      </div>
    </form>
  `,
  styles: [`
    .form-label {
      font-weight: 500;
      color: #495057;
    }
    .bg-light {
      background-color: #f8f9fa !important;
    }
    .text-danger {
      color: #dc3545 !important;
    }
    .border {
      border-color: #dee2e6 !important;
    }
    .form-text {
      font-size: 0.875rem;
      color: #6c757d;
    }
    .form-control-plaintext {
      background-color: #e9ecef;
    }
    h5, h6 {
      font-weight: 600;
    }
  `]
})
export class FinanceCompaniesUpdateFormComponent implements OnInit {
  @Input() company: FinanceCompany | null = null;
  @Input() loading = false;
  @Output() submitForm = new EventEmitter<UpdateFinanceCompanyDto>();
  @Output() cancelForm = new EventEmitter<void>();

  updateForm: FormGroup;
  private originalValues: any = {};

  constructor(private fb: FormBuilder) {
    this.updateForm = this.createForm();
  }

  ngOnInit() {
    if (this.company) {
      this.loadCompanyData();
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      companyName: ['', [Validators.required]],
      interestRate: ['', [Validators.min(0), Validators.max(100)]],
      maxFinanceMonths: ['', [Validators.min(1), Validators.max(120)]]
    });
  }

  private loadCompanyData() {
    if (this.company) {
      const formData = {
        companyName: this.company.companyName,
        interestRate: this.company.interestRate,
        maxFinanceMonths: this.company.maxFinanceMonths
      };
      
      this.updateForm.patchValue(formData);
      this.originalValues = { ...formData };
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.updateForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  hasChanges(): boolean {
    const currentValues = this.updateForm.value;
    return JSON.stringify(currentValues) !== JSON.stringify(this.originalValues);
  }

  onSubmit(): void {
    if (this.updateForm.valid && this.hasChanges()) {
      const formData = this.updateForm.value as UpdateFinanceCompanyDto;
      this.submitForm.emit(formData);
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.updateForm.controls).forEach(key => {
        this.updateForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.cancelForm.emit();
  }

  public setLoading(loading: boolean): void {
    this.loading = loading;
  }
}