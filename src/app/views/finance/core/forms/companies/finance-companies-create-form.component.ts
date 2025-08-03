import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterFinanceCompanyDto } from '@core/models';

@Component({
  selector: 'app-finance-companies-create-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="financeForm" (ngSubmit)="onSubmit()">
      <!-- Datos del Usuario -->
      <div class="row">
        <div class="col-12">
          <div class="mb-4">
            <h5 class="text-primary mb-3">
              <i class="bx bx-user me-2"></i>
              Información del Usuario
            </h5>
            <div class="border rounded p-3 bg-light">
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="firstName" class="form-label">
                      Nombre <span class="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="firstName"
                      formControlName="firstName"
                      placeholder="Ej: Carlos"
                      [class.is-invalid]="isFieldInvalid('firstName')"
                    />
                    <div class="invalid-feedback" *ngIf="isFieldInvalid('firstName')">
                      <div *ngIf="financeForm.get('firstName')?.errors?.['required']">
                        El nombre es requerido
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="lastName" class="form-label">
                      Apellido <span class="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="lastName"
                      formControlName="lastName"
                      placeholder="Ej: Martínez"
                      [class.is-invalid]="isFieldInvalid('lastName')"
                    />
                    <div class="invalid-feedback" *ngIf="isFieldInvalid('lastName')">
                      <div *ngIf="financeForm.get('lastName')?.errors?.['required']">
                        El apellido es requerido
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="email" class="form-label">
                      Email <span class="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      class="form-control"
                      id="email"
                      formControlName="email"
                      placeholder="financiera@ejemplo.com"
                      [class.is-invalid]="isFieldInvalid('email')"
                    />
                    <div class="invalid-feedback" *ngIf="isFieldInvalid('email')">
                      <div *ngIf="financeForm.get('email')?.errors?.['required']">
                        El email es requerido
                      </div>
                      <div *ngIf="financeForm.get('email')?.errors?.['email']">
                        Ingrese un email válido
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="phone" class="form-label">Teléfono</label>
                    <input
                      type="tel"
                      class="form-control"
                      id="phone"
                      formControlName="phone"
                      placeholder="809-555-1234"
                    />
                  </div>
                </div>
                <div class="col-12">
                  <div class="mb-3">
                    <label for="password" class="form-label">
                      Contraseña <span class="text-danger">*</span>
                    </label>
                    <div class="input-group">
                      <input
                        [type]="showPassword ? 'text' : 'password'"
                        class="form-control"
                        id="password"
                        formControlName="password"
                        placeholder="Mínimo 6 caracteres"
                        [class.is-invalid]="isFieldInvalid('password')"
                      />
                      <button
                        type="button"
                        class="btn btn-outline-secondary"
                        (click)="togglePassword()"
                      >
                        <i [class]="showPassword ? 'bx bx-hide' : 'bx bx-show'"></i>
                      </button>
                    </div>
                    <div class="invalid-feedback" *ngIf="isFieldInvalid('password')">
                      <div *ngIf="financeForm.get('password')?.errors?.['required']">
                        La contraseña es requerida
                      </div>
                      <div *ngIf="financeForm.get('password')?.errors?.['minlength']">
                        La contraseña debe tener al menos 6 caracteres
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Datos de la Financiera -->
      <div class="row">
        <div class="col-12">
          <div class="mb-4">
            <h5 class="text-success mb-3">
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
                      <div *ngIf="financeForm.get('companyName')?.errors?.['required']">
                        El nombre de la empresa es requerido
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="mb-3">
                    <label for="rnc" class="form-label">
                      RNC <span class="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="rnc"
                      formControlName="rnc"
                      placeholder="101123456"
                      [class.is-invalid]="isFieldInvalid('rnc')"
                    />
                    <div class="invalid-feedback" *ngIf="isFieldInvalid('rnc')">
                      <div *ngIf="financeForm.get('rnc')?.errors?.['required']">
                        El RNC es requerido
                      </div>
                      <div *ngIf="financeForm.get('rnc')?.errors?.['pattern']">
                        El RNC debe tener el formato correcto
                      </div>
                    </div>
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
                      <div *ngIf="financeForm.get('interestRate')?.errors?.['min']">
                        La tasa no puede ser negativa
                      </div>
                      <div *ngIf="financeForm.get('interestRate')?.errors?.['max']">
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
                      <div *ngIf="financeForm.get('maxFinanceMonths')?.errors?.['min']">
                        El plazo mínimo es 1 mes
                      </div>
                      <div *ngIf="financeForm.get('maxFinanceMonths')?.errors?.['max']">
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
              [disabled]="financeForm.invalid || loading"
            >
              <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
              <i *ngIf="!loading" class="bx bx-save me-1"></i>
              {{ loading ? 'Registrando...' : 'Registrar Financiera' }}
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
    h5 {
      font-weight: 600;
    }
  `]
})
export class FinanceCompaniesCreateFormComponent {
  @Input() loading = false;
  @Output() submitForm = new EventEmitter<RegisterFinanceCompanyDto>();
  @Output() cancelForm = new EventEmitter<void>();

  financeForm: FormGroup;
  showPassword = false;

  constructor(private fb: FormBuilder) {
    this.financeForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      // Datos del usuario
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      
      // Datos de la financiera
      companyName: ['', [Validators.required]],
      rnc: ['', [Validators.required, Validators.pattern(/^\d{9,11}$/)]],
      interestRate: ['', [Validators.min(0), Validators.max(100)]],
      maxFinanceMonths: ['', [Validators.min(1), Validators.max(120)]]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.financeForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.financeForm.valid) {
      const formData = this.financeForm.value as RegisterFinanceCompanyDto;
      this.submitForm.emit(formData);
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.financeForm.controls).forEach(key => {
        this.financeForm.get(key)?.markAsTouched();
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