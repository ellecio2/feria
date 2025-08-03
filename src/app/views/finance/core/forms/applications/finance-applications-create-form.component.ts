import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { FinanceApplicationsService, FinanceCompaniesService, VehiclesService } from '@core/services';
import { CreateFinanceApplicationDto, FinanceCompany, Vehicle, Client } from '@core/models';

@Component({
  selector: 'app-finance-applications-create-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="applicationForm" (ngSubmit)="onSubmit()">
      <!-- Client Selection -->
      <div class="row mb-4">
        <div class="col-12">
          <h6 class="fw-semibold text-muted text-uppercase mb-3">
            <i class="bx bx-user me-2"></i>Información del Cliente
          </h6>
        </div>
        <div class="col-md-6">
          <label for="clientId" class="form-label">Cliente <span class="text-danger">*</span></label>
          <select 
            class="form-select" 
            id="clientId" 
            formControlName="clientId"
            [class.is-invalid]="applicationForm.get('clientId')?.invalid && applicationForm.get('clientId')?.touched"
          >
            <option value="">Seleccione un cliente</option>
            <option *ngFor="let client of clients" [value]="client.id">
              {{ client.firstName }} {{ client.lastName }} - {{ client.email }}
            </option>
          </select>
          <div class="invalid-feedback" *ngIf="applicationForm.get('clientId')?.invalid && applicationForm.get('clientId')?.touched">
            <div *ngIf="applicationForm.get('clientId')?.errors?.['required']">
              El cliente es requerido
            </div>
          </div>
        </div>
      </div>

      <!-- Vehicle Selection -->
      <div class="row mb-4">
        <div class="col-12">
          <h6 class="fw-semibold text-muted text-uppercase mb-3">
            <i class="bx bx-car me-2"></i>Información del Vehículo
          </h6>
        </div>
        <div class="col-md-6">
          <label for="vehicleId" class="form-label">Vehículo <span class="text-danger">*</span></label>
          <select 
            class="form-select" 
            id="vehicleId" 
            formControlName="vehicleId"
            [class.is-invalid]="applicationForm.get('vehicleId')?.invalid && applicationForm.get('vehicleId')?.touched"
          >
            <option value="">Seleccione un vehículo</option>
            <option *ngFor="let vehicle of vehicles" [value]="vehicle.id">
              {{ vehicle.brand }} {{ vehicle.model }} {{ vehicle.year }} - {{ formatCurrency(vehicle.price || 0) }}
            </option>
          </select>
          <div class="invalid-feedback" *ngIf="applicationForm.get('vehicleId')?.invalid && applicationForm.get('vehicleId')?.touched">
            <div *ngIf="applicationForm.get('vehicleId')?.errors?.['required']">
              El vehículo es requerido
            </div>
          </div>
        </div>
      </div>

      <!-- Finance Company and Amount -->
      <div class="row mb-4">
        <div class="col-12">
          <h6 class="fw-semibold text-muted text-uppercase mb-3">
            <i class="bx bx-dollar-circle me-2"></i>Detalles del Financiamiento
          </h6>
        </div>
        <div class="col-md-6">
          <label for="financeCompanyId" class="form-label">Financiera <span class="text-danger">*</span></label>
          <select 
            class="form-select" 
            id="financeCompanyId" 
            formControlName="financeCompanyId"
            [class.is-invalid]="applicationForm.get('financeCompanyId')?.invalid && applicationForm.get('financeCompanyId')?.touched"
          >
            <option value="">Seleccione una financiera</option>
            <option *ngFor="let company of financeCompanies" [value]="company.id">
              {{ company.companyName }} - {{ company.interestRate }}% anual
            </option>
          </select>
          <div class="invalid-feedback" *ngIf="applicationForm.get('financeCompanyId')?.invalid && applicationForm.get('financeCompanyId')?.touched">
            <div *ngIf="applicationForm.get('financeCompanyId')?.errors?.['required']">
              La financiera es requerida
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <label for="requestedAmount" class="form-label">Monto Solicitado <span class="text-danger">*</span></label>
          <div class="input-group">
            <span class="input-group-text">RD$</span>
            <input 
              type="number" 
              class="form-control" 
              id="requestedAmount" 
              formControlName="requestedAmount"
              [class.is-invalid]="applicationForm.get('requestedAmount')?.invalid && applicationForm.get('requestedAmount')?.touched"
              placeholder="0.00"
            >
          </div>
          <div class="invalid-feedback" *ngIf="applicationForm.get('requestedAmount')?.invalid && applicationForm.get('requestedAmount')?.touched">
            <div *ngIf="applicationForm.get('requestedAmount')?.errors?.['required']">
              El monto es requerido
            </div>
            <div *ngIf="applicationForm.get('requestedAmount')?.errors?.['min']">
              El monto debe ser mayor a 0
            </div>
          </div>
        </div>
      </div>

      <div class="row mb-4">
        <div class="col-md-6">
          <label for="downPayment" class="form-label">Pago Inicial</label>
          <div class="input-group">
            <span class="input-group-text">RD$</span>
            <input 
              type="number" 
              class="form-control" 
              id="downPayment" 
              formControlName="downPayment"
              placeholder="0.00"
            >
          </div>
        </div>
        <div class="col-md-6">
          <label for="financeMonths" class="form-label">Plazo en Meses <span class="text-danger">*</span></label>
          <select 
            class="form-select" 
            id="financeMonths" 
            formControlName="financeMonths"
            [class.is-invalid]="applicationForm.get('financeMonths')?.invalid && applicationForm.get('financeMonths')?.touched"
          >
            <option value="">Seleccione el plazo</option>
            <option value="12">12 meses</option>
            <option value="24">24 meses</option>
            <option value="36">36 meses</option>
            <option value="48">48 meses</option>
            <option value="60">60 meses</option>
            <option value="72">72 meses</option>
            <option value="84">84 meses</option>
          </select>
          <div class="invalid-feedback" *ngIf="applicationForm.get('financeMonths')?.invalid && applicationForm.get('financeMonths')?.touched">
            <div *ngIf="applicationForm.get('financeMonths')?.errors?.['required']">
              El plazo es requerido
            </div>
          </div>
        </div>
      </div>

      <!-- Co-Debtors Section -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h6 class="fw-semibold text-muted text-uppercase mb-0">
              <i class="bx bx-group me-2"></i>Codeudores
            </h6>
            <button 
              type="button" 
              class="btn btn-outline-primary btn-sm"
              (click)="addCoDebtor()"
            >
              <i class="bx bx-plus me-1"></i> Agregar Codeudor
            </button>
          </div>
          
          <div formArrayName="coDebtors">
            <div *ngFor="let coDebtor of coDebtorsArray.controls; let i = index" class="card mb-3">
              <div class="card-body" [formGroupName]="i">
                <div class="row">
                  <div class="col-md-4">
                    <label class="form-label">Nombre</label>
                    <input type="text" class="form-control" formControlName="firstName" placeholder="Nombre">
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">Apellido</label>
                    <input type="text" class="form-control" formControlName="lastName" placeholder="Apellido">
                  </div>
                  <div class="col-md-3">
                    <label class="form-label">Cédula</label>
                    <input type="text" class="form-control" formControlName="cedula" placeholder="000-0000000-0">
                  </div>
                  <div class="col-md-1 d-flex align-items-end">
                    <button 
                      type="button" 
                      class="btn btn-outline-danger btn-sm"
                      (click)="removeCoDebtor(i)"
                    >
                      <i class="bx bx-trash"></i>
                    </button>
                  </div>
                </div>
                <div class="row mt-2">
                  <div class="col-md-4">
                    <label class="form-label">Teléfono</label>
                    <input type="tel" class="form-control" formControlName="phone" placeholder="(000) 000-0000">
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">Relación</label>
                    <input type="text" class="form-control" formControlName="relationship" placeholder="Ej: Esposo/a, Padre, etc.">
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">Ingresos Mensuales</label>
                    <div class="input-group">
                      <span class="input-group-text">RD$</span>
                      <input type="number" class="form-control" formControlName="monthlyIncome" placeholder="0.00">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- References Section -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h6 class="fw-semibold text-muted text-uppercase mb-0">
              <i class="bx bx-phone me-2"></i>Referencias
            </h6>
            <button 
              type="button" 
              class="btn btn-outline-primary btn-sm"
              (click)="addReference()"
            >
              <i class="bx bx-plus me-1"></i> Agregar Referencia
            </button>
          </div>
          
          <div formArrayName="references">
            <div *ngFor="let reference of referencesArray.controls; let i = index" class="card mb-3">
              <div class="card-body" [formGroupName]="i">
                <div class="row">
                  <div class="col-md-4">
                    <label class="form-label">Nombre</label>
                    <input type="text" class="form-control" formControlName="name" placeholder="Nombre completo">
                  </div>
                  <div class="col-md-3">
                    <label class="form-label">Teléfono</label>
                    <input type="tel" class="form-control" formControlName="phone" placeholder="(000) 000-0000">
                  </div>
                  <div class="col-md-3">
                    <label class="form-label">Relación</label>
                    <input type="text" class="form-control" formControlName="relationship" placeholder="Ej: Amigo, Colega">
                  </div>
                  <div class="col-md-1 d-flex align-items-end">
                    <button 
                      type="button" 
                      class="btn btn-outline-danger btn-sm"
                      (click)="removeReference(i)"
                    >
                      <i class="bx bx-trash"></i>
                    </button>
                  </div>
                </div>
                <div class="row mt-2">
                  <div class="col-md-4">
                    <div class="form-check">
                      <input 
                        class="form-check-input" 
                        type="checkbox" 
                        formControlName="isWorkReference"
                      >
                      <label class="form-check-label">
                        Es referencia laboral
                      </label>
                    </div>
                  </div>
                </div>
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
              [disabled]="applicationForm.invalid || submitting"
            >
              <span *ngIf="submitting" class="spinner-border spinner-border-sm me-2"></span>
              <i *ngIf="!submitting" class="bx bx-check me-1"></i>
              {{ submitting ? 'Creando...' : 'Crear Solicitud' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div *ngIf="errorMessage" class="alert alert-danger mt-3" role="alert">
        {{ errorMessage }}
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
  `]
})
export class FinanceApplicationsCreateFormComponent implements OnInit {
  @Output() applicationCreated = new EventEmitter<any>();
  @Output() cancelled = new EventEmitter<void>();

  applicationForm: FormGroup;
  submitting = false;
  errorMessage: string | null = null;

  // Data for dropdowns
  clients: Client[] = [];
  vehicles: Vehicle[] = [];
  financeCompanies: FinanceCompany[] = [];

  constructor(
    private fb: FormBuilder,
    private applicationsService: FinanceApplicationsService,
    private financeCompaniesService: FinanceCompaniesService,
    private vehiclesService: VehiclesService
  ) {
    this.applicationForm = this.createForm();
  }

  ngOnInit() {
    this.loadInitialData();
  }

  createForm(): FormGroup {
    return this.fb.group({
      clientId: ['', [Validators.required]],
      vehicleId: ['', [Validators.required]],
      financeCompanyId: ['', [Validators.required]],
      requestedAmount: [0, [Validators.required, Validators.min(1)]],
      downPayment: [0],
      financeMonths: [0, [Validators.required]],
      coDebtors: this.fb.array([]),
      references: this.fb.array([])
    });
  }

  get coDebtorsArray(): FormArray {
    return this.applicationForm.get('coDebtors') as FormArray;
  }

  get referencesArray(): FormArray {
    return this.applicationForm.get('references') as FormArray;
  }

  loadInitialData() {
    // TODO: Load clients, vehicles, and finance companies
    // For now, using empty arrays - you'll need to implement the services
    
    // this.clientsService.getAll().subscribe(clients => this.clients = clients);
    // this.vehiclesService.getAll().subscribe(vehicles => this.vehicles = vehicles);
    
    this.financeCompaniesService.getAll().subscribe({
      next: (companies) => {
        this.financeCompanies = companies.filter(c => c.isActive);
      },
      error: (error) => {
        console.error('Error loading finance companies:', error);
      }
    });
  }

  addCoDebtor() {
    const coDebtorGroup = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      cedula: ['', [Validators.required]],
      phone: [''],
      relationship: [''],
      monthlyIncome: [0]
    });

    this.coDebtorsArray.push(coDebtorGroup);
  }

  removeCoDebtor(index: number) {
    this.coDebtorsArray.removeAt(index);
  }

  addReference() {
    const referenceGroup = this.fb.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      relationship: [''],
      isWorkReference: [false]
    });

    this.referencesArray.push(referenceGroup);
  }

  removeReference(index: number) {
    this.referencesArray.removeAt(index);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP'
    }).format(amount);
  }

  onSubmit() {
    if (this.applicationForm.invalid) {
      this.applicationForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.errorMessage = null;

    const formValue = this.applicationForm.value;
    const createDto: CreateFinanceApplicationDto = {
      clientId: formValue.clientId,
      vehicleId: formValue.vehicleId,
      financeCompanyId: formValue.financeCompanyId,
      requestedAmount: formValue.requestedAmount,
      downPayment: formValue.downPayment || 0,
      financeMonths: formValue.financeMonths,
      coDebtors: formValue.coDebtors || [],
      references: formValue.references || []
    };

    this.applicationsService.create(createDto).subscribe({
      next: (response) => {
        this.submitting = false;
        this.applicationCreated.emit(response);
      },
      error: (error) => {
        this.submitting = false;
        this.errorMessage = error.error?.message || 'Error al crear la solicitud. Intente nuevamente.';
        console.error('Error creating application:', error);
      }
    });
  }

  onCancel() {
    this.cancelled.emit();
  }
}