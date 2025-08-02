import { Component, OnInit, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateVehicleDto } from '../../../../core/models';

@Component({
  selector: 'app-vehicles-create-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="vehicleForm" (ngSubmit)="onSubmit()">
      <!-- Información Básica -->
      <div class="row mb-4">
        <div class="col-12">
          <h5 class="font-size-14 mb-3">
            <i class="bx bx-car me-1 text-primary"></i> Información Básica
          </h5>
        </div>
        
        <div class="col-md-4 mb-3">
          <label for="brand" class="form-label">Marca <span class="text-danger">*</span></label>
          <input
            type="text"
            class="form-control"
            id="brand"
            formControlName="brand"
            placeholder="Ej: Toyota"
            [class.is-invalid]="isFieldInvalid('brand')"
          />
          <div *ngIf="isFieldInvalid('brand')" class="invalid-feedback">
            La marca es requerida
          </div>
        </div>

        <div class="col-md-4 mb-3">
          <label for="model" class="form-label">Modelo <span class="text-danger">*</span></label>
          <input
            type="text"
            class="form-control"
            id="model"
            formControlName="model"
            placeholder="Ej: Corolla"
            [class.is-invalid]="isFieldInvalid('model')"
          />
          <div *ngIf="isFieldInvalid('model')" class="invalid-feedback">
            El modelo es requerido
          </div>
        </div>

        <div class="col-md-4 mb-3">
          <label for="year" class="form-label">Año <span class="text-danger">*</span></label>
          <input
            type="number"
            class="form-control"
            id="year"
            formControlName="year"
            [min]="1900"
            [max]="currentYear + 1"
            placeholder="Ej: 2023"
            [class.is-invalid]="isFieldInvalid('year')"
          />
          <div *ngIf="isFieldInvalid('year')" class="invalid-feedback">
            <span *ngIf="vehicleForm.get('year')?.errors?.['required']">El año es requerido</span>
            <span *ngIf="vehicleForm.get('year')?.errors?.['min']">El año debe ser mayor a 1900</span>
            <span *ngIf="vehicleForm.get('year')?.errors?.['max']">El año no puede ser mayor a {{ currentYear + 1 }}</span>
          </div>
        </div>

        <div class="col-md-4 mb-3">
          <label for="color" class="form-label">Color</label>
          <input
            type="text"
            class="form-control"
            id="color"
            formControlName="color"
            placeholder="Ej: Blanco"
          />
        </div>

        <div class="col-md-4 mb-3">
          <label for="fuelType" class="form-label">Tipo de Combustible</label>
          <select class="form-select" id="fuelType" formControlName="fuelType">
            <option value="gasolina">Gasolina</option>
            <option value="diesel">Diésel</option>
            <option value="híbrido">Híbrido</option>
            <option value="eléctrico">Eléctrico</option>
            <option value="gas">Gas</option>
          </select>
        </div>

        <div class="col-md-4 mb-3">
          <label for="transmission" class="form-label">Transmisión</label>
          <select class="form-select" id="transmission" formControlName="transmission">
            <option value="manual">Manual</option>
            <option value="automática">Automática</option>
            <option value="cvt">CVT</option>
          </select>
        </div>

        <div class="col-md-4 mb-3">
          <label class="form-label">Placa del Vehículo</label>
          <div class="form-check mb-2">
            <input
              class="form-check-input"
              type="checkbox"
              id="hasPlate"
              formControlName="hasPlate"
            />
            <label class="form-check-label" for="hasPlate">
              ¿Posee placa?
            </label>
          </div>
          <input
            type="text"
            class="form-control"
            id="plate"
            formControlName="plate"
            placeholder="Ej: ABC-1234"
            maxlength="20"
            [class.is-invalid]="isFieldInvalid('plate')"
          />
          <div *ngIf="isFieldInvalid('plate')" class="invalid-feedback">
            La placa no puede exceder 20 caracteres
          </div>
        </div>
      </div>

      <!-- Especificaciones Técnicas -->
      <div class="row mb-4">
        <div class="col-12">
          <h5 class="font-size-14 mb-3">
            <i class="bx bx-cog me-1 text-primary"></i> Especificaciones Técnicas
          </h5>
        </div>

        <div class="col-md-4 mb-3">
          <label for="engine" class="form-label">Motor</label>
          <input
            type="text"
            class="form-control"
            id="engine"
            formControlName="engine"
            placeholder="Ej: 1.8L"
          />
        </div>

        <div class="col-md-4 mb-3">
          <label for="doors" class="form-label">Puertas</label>
          <select class="form-select" id="doors" formControlName="doors">
            <option value="">Seleccionar</option>
            <option value="2">2 Puertas</option>
            <option value="3">3 Puertas</option>
            <option value="4">4 Puertas</option>
            <option value="5">5 Puertas</option>
          </select>
        </div>

        <div class="col-md-4 mb-3">
          <label for="seats" class="form-label">Asientos</label>
          <select class="form-select" id="seats" formControlName="seats">
            <option value="">Seleccionar</option>
            <option value="2">2 Asientos</option>
            <option value="4">4 Asientos</option>
            <option value="5">5 Asientos</option>
            <option value="7">7 Asientos</option>
            <option value="8">8 Asientos</option>
            <option value="9">9 Asientos</option>
          </select>
        </div>
      </div>

      <!-- Condición y Estado -->
      <div class="row mb-4">
        <div class="col-12">
          <h5 class="font-size-14 mb-3">
            <i class="bx bx-info-circle me-1 text-primary"></i> Condición y Estado
          </h5>
        </div>

        <div class="col-md-4 mb-3">
          <label for="mileage" class="form-label">Kilometraje <span class="text-danger">*</span></label>
          <div class="input-group">
            <input
              type="number"
              class="form-control"
              id="mileage"
              formControlName="mileage"
              min="0"
              step="1"
              placeholder="0"
              [class.is-invalid]="isFieldInvalid('mileage')"
            />
            <span class="input-group-text">km</span>
          </div>
          <div *ngIf="isFieldInvalid('mileage')" class="invalid-feedback">
            <span *ngIf="vehicleForm.get('mileage')?.errors?.['required']">El kilometraje es requerido</span>
            <span *ngIf="vehicleForm.get('mileage')?.errors?.['min']">El kilometraje debe ser mayor a 0</span>
          </div>
        </div>

        <div class="col-md-4 mb-3">
          <label for="condition" class="form-label">Condición <span class="text-danger">*</span></label>
          <select
            class="form-select"
            id="condition"
            formControlName="condition"
            [class.is-invalid]="isFieldInvalid('condition')"
          >
            <option value="">Seleccionar condición</option>
            <option value="nuevo">Nuevo</option>
            <option value="usado">Usado</option>
            <option value="certificado">Certificado</option>
          </select>
          <div *ngIf="isFieldInvalid('condition')" class="invalid-feedback">
            La condición es requerida
          </div>
        </div>

        <div class="col-md-4 mb-3">
          <label for="previousOwners" class="form-label">Propietarios Anteriores</label>
          <input
            type="number"
            class="form-control"
            id="previousOwners"
            formControlName="previousOwners"
            min="0"
            max="10"
            placeholder="0"
          />
        </div>

        <!-- Checkbox de accidentes (solo si no es nuevo) -->
        <div class="col-12 mb-3" *ngIf="vehicleForm.get('condition')?.value !== 'nuevo'">
          <label class="form-label">Historial de Accidentes</label>
          <div class="form-check mb-2">
            <input
              class="form-check-input"
              type="checkbox"
              id="hasAccident"
              formControlName="hasAccident"
            />
            <label class="form-check-label" for="hasAccident">
              ¿Ha tenido accidentes?
            </label>
          </div>
        </div>

        <!-- Descripción del accidente (solo si tiene accidentes) -->
        <div class="col-12 mb-3" *ngIf="vehicleForm.get('hasAccident')?.value">
          <label for="accidentDescription" class="form-label">Descripción del Accidente Más Reciente</label>
          <textarea
            class="form-control"
            id="accidentDescription"
            formControlName="accidentDescription"
            rows="3"
            placeholder="Describa el accidente más reciente..."
            maxlength="500"
            [class.is-invalid]="isFieldInvalid('accidentDescription')"
          ></textarea>
          <div class="form-text">Máximo 500 caracteres</div>
          <div *ngIf="isFieldInvalid('accidentDescription')" class="invalid-feedback">
            La descripción no puede exceder 500 caracteres
          </div>
        </div>

        <div class="col-12 mb-3">
          <label for="description" class="form-label">Descripción General</label>
          <textarea
            class="form-control"
            id="description"
            formControlName="description"
            rows="3"
            placeholder="Descripción detallada del vehículo..."
          ></textarea>
        </div>
      </div>

      <!-- Precios -->
      <div class="row mb-4">
        <div class="col-12">
          <h5 class="font-size-14 mb-3">
            <i class="bx bx-dollar-circle me-1 text-primary"></i> Información de Precios
          </h5>
        </div>

        <div class="col-md-4 mb-3">
          <label for="originalPrice" class="form-label">Precio Original <span class="text-danger">*</span></label>
          <div class="input-group">
            <span class="input-group-text">DOP$</span>
            <input
              type="number"
              class="form-control"
              id="originalPrice"
              formControlName="originalPrice"
              min="0"
              step="0.01"
              placeholder="0.00"
              [class.is-invalid]="isFieldInvalid('originalPrice')"
            />
          </div>
          <div *ngIf="isFieldInvalid('originalPrice')" class="invalid-feedback">
            El precio original es requerido
          </div>
        </div>

        <div class="col-md-4 mb-3">
          <label for="currentPrice" class="form-label">Precio Actual</label>
          <div class="input-group">
            <span class="input-group-text">DOP$</span>
            <input
              type="number"
              class="form-control"
              id="currentPrice"
              formControlName="currentPrice"
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </div>
        </div>

        <div class="col-md-4 mb-3">
          <label for="minAcceptablePrice" class="form-label">Precio Mínimo Aceptable</label>
          <div class="input-group">
            <span class="input-group-text">DOP$</span>
            <input
              type="number"
              class="form-control"
              id="minAcceptablePrice"
              formControlName="minAcceptablePrice"
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      <!-- Estado del Vehículo -->
      <div class="row mb-4">
        <div class="col-12">
          <h5 class="font-size-14 mb-3">
            <i class="bx bx-check-circle me-1 text-primary"></i> Estado
          </h5>
        </div>

        <div class="col-md-6 mb-3">
          <label for="status" class="form-label">Estado del Vehículo</label>
          <select class="form-select" id="status" formControlName="status">
            <option value="DISPONIBLE">Disponible</option>
            <option value="RESERVADO">Reservado</option>
            <option value="EN_MANTENIMIENTO">En Mantenimiento</option>
            <option value="INACTIVO">Inactivo</option>
          </select>
        </div>
      </div>

      <!-- Botones -->
      <div class="row">
        <div class="col-12">
          <div class="d-flex gap-2 justify-content-end">
            <button
              type="button"
              class="btn btn-soft-secondary"
              (click)="onCancel()"
              [disabled]="loading"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="vehicleForm.invalid || loading"
            >
              <span *ngIf="loading" class="spinner-border spinner-border-sm me-1"></span>
              <i *ngIf="!loading" class="bx bx-save me-1"></i>
              {{ loading ? 'Guardando...' : 'Guardar Vehículo' }}
            </button>
          </div>
        </div>
      </div>
    </form>
  `,
  styles: [`
    .form-label {
      font-weight: 500;
    }
    .text-danger {
      color: #f1556c !important;
    }
    .input-group-text {
      background-color: #f8f9fa;
      border-color: #ced4da;
    }
    h5 {
      color: #495057;
      border-bottom: 2px solid #e9ecef;
      padding-bottom: 8px;
    }
  `]
})
export class VehiclesCreateFormComponent implements OnInit {
  private fb = inject(FormBuilder);

  @Output() submitForm = new EventEmitter<CreateVehicleDto>();
  @Output() cancelForm = new EventEmitter<void>();

  vehicleForm!: FormGroup;
  loading = false;
  currentYear = new Date().getFullYear();

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.vehicleForm = this.fb.group({
      brand: ['', [Validators.required, Validators.maxLength(100)]],
      model: ['', [Validators.required, Validators.maxLength(100)]],
      year: ['', [Validators.required, Validators.min(1900), Validators.max(this.currentYear + 1)]],
      color: [''],
      fuelType: ['gasolina'],
      transmission: ['manual'],
      engine: [''],
      doors: [''],
      seats: [''],
      mileage: ['', [Validators.required, Validators.min(0)]],
      hasPlate: [false],
      plate: [''],
      condition: ['', Validators.required],
      description: [''],
      hasAccident: [false],
      accidentDescription: [''],
      previousOwners: ['', [Validators.min(0), Validators.max(10)]],
      originalPrice: ['', [Validators.required, Validators.min(0)]],
      currentPrice: ['', Validators.min(0)],
      minAcceptablePrice: ['', Validators.min(0)],
      status: ['DISPONIBLE']
    });

    this.setupFormListeners();
  }

  private setupFormListeners() {
    // Escuchar cambios en el checkbox de placa
    this.vehicleForm.get('hasPlate')?.valueChanges.subscribe(hasPlate => {
      const plateControl = this.vehicleForm.get('plate');
      if (hasPlate) {
        plateControl?.enable();
        plateControl?.setValidators([Validators.maxLength(20)]);
      } else {
        plateControl?.disable();
        plateControl?.setValue('');
        plateControl?.clearValidators();
      }
      plateControl?.updateValueAndValidity();
    });

    // Escuchar cambios en el checkbox de accidentes
    this.vehicleForm.get('hasAccident')?.valueChanges.subscribe(hasAccident => {
      const accidentDescControl = this.vehicleForm.get('accidentDescription');
      if (hasAccident) {
        accidentDescControl?.enable();
        accidentDescControl?.setValidators([Validators.maxLength(500)]);
      } else {
        accidentDescControl?.disable();
        accidentDescControl?.setValue('');
        accidentDescControl?.clearValidators();
      }
      accidentDescControl?.updateValueAndValidity();
    });

    // Escuchar cambios en la condición para mostrar/ocultar accidentes
    this.vehicleForm.get('condition')?.valueChanges.subscribe(condition => {
      const hasAccidentControl = this.vehicleForm.get('hasAccident');
      const accidentDescControl = this.vehicleForm.get('accidentDescription');
      
      if (condition === 'nuevo') {
        hasAccidentControl?.setValue(false);
        hasAccidentControl?.disable();
        accidentDescControl?.setValue('');
        accidentDescControl?.disable();
      } else {
        hasAccidentControl?.enable();
      }
    });

    // Inicialmente deshabilitar campos
    this.vehicleForm.get('plate')?.disable();
    this.vehicleForm.get('accidentDescription')?.disable();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.vehicleForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  onSubmit() {
    if (this.vehicleForm.invalid) {
      this.vehicleForm.markAllAsTouched();
      return;
    }

    // Obtener valores del formulario excluyendo campos de control
    const { hasPlate, hasAccident, ...formValues } = this.vehicleForm.value;

    // Construir el payload
    const formData: CreateVehicleDto = {
      // Campos requeridos
      brand: formValues.brand.trim(),
      model: formValues.model.trim(),
      year: parseInt(formValues.year, 10),
      mileage: parseInt(formValues.mileage, 10),
      condition: formValues.condition,
      originalPrice: parseFloat(formValues.originalPrice),
      
      // Campos opcionales solo si tienen valor
      ...(formValues.color && formValues.color.trim() && { color: formValues.color.trim() }),
      ...(formValues.fuelType && { fuelType: formValues.fuelType }),
      ...(formValues.transmission && { transmission: formValues.transmission }),
      ...(formValues.engine && formValues.engine.trim() && { engine: formValues.engine.trim() }),
      ...(formValues.doors && { doors: parseInt(formValues.doors, 10) }),
      ...(formValues.seats && { seats: parseInt(formValues.seats, 10) }),
      ...(hasPlate && formValues.plate && formValues.plate.trim() && { plate: formValues.plate.trim() }),
      ...(formValues.description && formValues.description.trim() && { description: formValues.description.trim() }),
      ...(formValues.previousOwners && { previousOwners: parseInt(formValues.previousOwners, 10) }),
      ...(formValues.currentPrice && { currentPrice: parseFloat(formValues.currentPrice) }),
      ...(formValues.minAcceptablePrice && { minAcceptablePrice: parseFloat(formValues.minAcceptablePrice) }),
      ...(formValues.status && { status: formValues.status }),
      
      // Nuevos campos de accidentes
      ...(formValues.condition !== 'nuevo' && { accident: hasAccident }),
      ...(hasAccident && formValues.accidentDescription && formValues.accidentDescription.trim() && { 
        accidentDescription: formValues.accidentDescription.trim() 
      })
    };

    this.submitForm.emit(formData);
  }

  onCancel() {
    this.cancelForm.emit();
  }
}