import { Component, OnInit, Input, Output, EventEmitter, inject, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Vehicle, UpdateVehicleDto } from '../../../../core/models';

@Component({
  selector: 'app-vehicles-update-form',
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
            <option value="EN_EVALUACION">En Evaluación</option>
            <option value="RESERVADO">Reservado</option>
            <option value="VENDIDO_FINANCIADO">Vendido (Financiado)</option>
            <option value="VENDIDO_CASH">Vendido (Efectivo)</option>
            <option value="ENTREGADO">Entregado</option>
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
              class="btn btn-warning"
              [disabled]="vehicleForm.invalid || loading"
            >
              <span *ngIf="loading" class="spinner-border spinner-border-sm me-1"></span>
              <i *ngIf="!loading" class="bx bx-save me-1"></i>
              {{ loading ? 'Actualizando...' : 'Actualizar Vehículo' }}
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
export class VehiclesUpdateFormComponent implements OnInit, OnChanges, AfterViewInit {
  private fb = inject(FormBuilder);

  @Input() vehicle: Vehicle | null = null;
  @Output() submitForm = new EventEmitter<UpdateVehicleDto>();
  @Output() cancelForm = new EventEmitter<void>();

  vehicleForm!: FormGroup;
  loading = false;
  currentYear = new Date().getFullYear();

  ngOnInit() {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['vehicle'] && this.vehicle && this.vehicleForm) {
      this.populateForm();
    }
  }

  ngAfterViewInit() {
    // Forzar la actualización del status después de que el view esté inicializado
    if (this.vehicle && this.vehicleForm) {
      setTimeout(() => {
        const normalizedStatus = this.vehicle!.status?.toUpperCase() || 'DISPONIBLE';
        this.vehicleForm.get('status')?.setValue(normalizedStatus);
        this.vehicleForm.get('status')?.markAsPristine();
      }, 200);
    }
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
    
    // Si ya tenemos el vehículo, poblamos el formulario
    if (this.vehicle) {
      this.populateForm();
    }
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
  }

  private populateForm() {
    if (!this.vehicle || !this.vehicleForm) return;

    const hasPlate = !!this.vehicle.plate;
    const hasAccident = !!this.vehicle.accident;

    // ✅ Convertir el status a mayúsculas si viene en minúsculas
    const normalizedStatus = this.mapStatus(this.vehicle.status);

    this.vehicleForm.patchValue({
      brand: this.vehicle.brand,
      model: this.vehicle.model,
      year: this.vehicle.year,
      color: this.vehicle.color || '',
      fuelType: this.vehicle.fuelType || 'gasolina',
      transmission: this.vehicle.transmission || 'manual',
      engine: this.vehicle.engine || '',
      doors: this.vehicle.doors || '',
      seats: this.vehicle.seats || '',
      mileage: this.vehicle.mileage,
      hasPlate: hasPlate,
      plate: this.vehicle.plate || '',
      condition: this.vehicle.condition,
      description: this.vehicle.description || '',
      hasAccident: hasAccident,
      accidentDescription: this.vehicle.accidentDescription || '',
      previousOwners: this.vehicle.previousOwners || '',
      originalPrice: this.vehicle.originalPrice,
      currentPrice: this.vehicle.currentPrice || '',
      minAcceptablePrice: this.vehicle.minAcceptablePrice || '',
      // ✅ Usar el status normalizado
      status: normalizedStatus
    });

    // ✅ Si aún no funciona, usar setValue directamente
    setTimeout(() => {
      this.vehicleForm.get('status')?.setValue(normalizedStatus);
      this.vehicleForm.get('status')?.updateValueAndValidity();
    }, 50);

    // Configurar estado inicial de campos condicionales
    if (!hasPlate) {
      this.vehicleForm.get('plate')?.disable();
    }
    
    if (!hasAccident || this.vehicle.condition === 'nuevo') {
      this.vehicleForm.get('accidentDescription')?.disable();
    }
  }

  private mapStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'disponible': 'DISPONIBLE',
      'en_evaluacion': 'EN_EVALUACION',
      'reservado': 'RESERVADO',
      'vendido_financiado': 'VENDIDO_FINANCIADO',
      'vendido_cash': 'VENDIDO_CASH',
      'entregado': 'ENTREGADO',
      'en_mantenimiento': 'EN_MANTENIMIENTO',
      'inactivo': 'INACTIVO'
    };

    const normalizedInput = status?.toLowerCase() || '';
    return statusMap[normalizedInput] || status?.toUpperCase() || 'DISPONIBLE';
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

    // Construir el payload solo con campos que han cambiado
    const formData: UpdateVehicleDto = {};

    // Comparar con valores originales y solo incluir lo que cambió
    if (formValues.brand !== this.vehicle?.brand) {
      formData.brand = formValues.brand.trim();
    }
    if (formValues.model !== this.vehicle?.model) {
      formData.model = formValues.model.trim();
    }
    if (parseInt(formValues.year, 10) !== this.vehicle?.year) {
      formData.year = parseInt(formValues.year, 10);
    }
    if (parseInt(formValues.mileage, 10) !== this.vehicle?.mileage) {
      formData.mileage = parseInt(formValues.mileage, 10);
    }
    if (formValues.condition !== this.vehicle?.condition) {
      formData.condition = formValues.condition;
    }
    if (parseFloat(formValues.originalPrice) !== this.vehicle?.originalPrice) {
      formData.originalPrice = parseFloat(formValues.originalPrice);
    }

    // Campos opcionales
    const color = formValues.color?.trim() || null;
    if (color !== (this.vehicle?.color || null)) {
      formData.color = color;
    }

    if (formValues.fuelType !== this.vehicle?.fuelType) {
      formData.fuelType = formValues.fuelType;
    }

    if (formValues.transmission !== this.vehicle?.transmission) {
      formData.transmission = formValues.transmission;
    }

    const engine = formValues.engine?.trim() || null;
    if (engine !== (this.vehicle?.engine || null)) {
      formData.engine = engine;
    }

    if (formValues.doors && parseInt(formValues.doors, 10) !== this.vehicle?.doors) {
      formData.doors = parseInt(formValues.doors, 10);
    }

    if (formValues.seats && parseInt(formValues.seats, 10) !== this.vehicle?.seats) {
      formData.seats = parseInt(formValues.seats, 10);
    }

    const plate = hasPlate && formValues.plate?.trim() ? formValues.plate.trim() : null;
    if (plate !== (this.vehicle?.plate || null)) {
      formData.plate = plate;
    }

    const description = formValues.description?.trim() || null;
    if (description !== (this.vehicle?.description || null)) {
      formData.description = description;
    }

    if (formValues.previousOwners && parseInt(formValues.previousOwners, 10) !== this.vehicle?.previousOwners) {
      formData.previousOwners = parseInt(formValues.previousOwners, 10);
    }

    if (formValues.currentPrice && parseFloat(formValues.currentPrice) !== this.vehicle?.currentPrice) {
      formData.currentPrice = parseFloat(formValues.currentPrice);
    }

    if (formValues.minAcceptablePrice && parseFloat(formValues.minAcceptablePrice) !== this.vehicle?.minAcceptablePrice) {
      formData.minAcceptablePrice = parseFloat(formValues.minAcceptablePrice);
    }

    if (formValues.status !== this.vehicle?.status) {
      formData.status = formValues.status;
    }

    // Campos de accidentes
    if (formValues.condition !== 'nuevo') {
      if (hasAccident !== !!this.vehicle?.accident) {
        formData.accident = hasAccident;
      }

      const accidentDesc = hasAccident && formValues.accidentDescription?.trim() ? formValues.accidentDescription.trim() : null;
      if (accidentDesc !== (this.vehicle?.accidentDescription || null)) {
        formData.accidentDescription = accidentDesc;
      }
    }

    // Solo enviar si hay cambios
    if (Object.keys(formData).length === 0) {
      this.onCancel();
      return;
    }

    this.submitForm.emit(formData);
  }

  onCancel() {
    this.cancelForm.emit();
  }
}