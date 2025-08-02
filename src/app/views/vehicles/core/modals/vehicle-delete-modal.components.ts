import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vehicle } from '@core/models';

declare const bootstrap: any;

@Component({
  selector: 'app-vehicle-delete-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Delete Confirmation Modal -->
    <div class="modal fade" id="vehicleDeleteModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-bottom">
            <h5 class="modal-title">
              <i class="bx bx-error-circle text-warning me-2"></i>
              Confirmar Eliminación
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
          </div>
          <div class="modal-body p-4">
            <div *ngIf="vehicle" class="text-center">
              <div class="mb-4">
                <div class="avatar-lg mx-auto mb-3">
                  <div class="avatar-title rounded-circle bg-warning-subtle text-warning">
                    <i class="bx bx-error-circle display-5"></i>
                  </div>
                </div>
                <h5 class="mb-3">¿Está seguro de que desea eliminar este vehículo?</h5>
              </div>
              
              <div class="alert alert-warning border-warning mb-4" role="alert">
                <div class="d-flex align-items-center">
                  <div class="flex-shrink-0">
                    <i class="bx bx-car text-warning fs-4"></i>
                  </div>
                  <div class="flex-grow-1 ms-3 text-start">
                    <h6 class="mb-1 text-warning">
                      {{ vehicle.brand }} {{ vehicle.model }} {{ vehicle.year }}
                    </h6>
                    <small class="text-muted">Esta acción no se puede deshacer</small>
                  </div>
                </div>
              </div>
              
              <div class="px-3">
                <p class="text-muted mb-0 lh-base">
                  Se eliminarán todos los datos asociados al vehículo, incluyendo 
                  <strong>imágenes</strong>, <strong>registros de visualización</strong> 
                  y cualquier información relacionada.
                </p>
              </div>
              
              <!-- Error Message in Modal -->
              <div *ngIf="errorMessage" class="alert alert-danger mt-3" role="alert">
                {{ errorMessage }}
              </div>
            </div>
          </div>
          <div class="modal-footer border-top px-4 py-3">
            <button 
              type="button" 
              class="btn btn-light me-2" 
              data-bs-dismiss="modal"
              [disabled]="deleting"
            >
              <i class="bx bx-x me-1"></i>
              Cancelar
            </button>
            <button 
              type="button" 
              class="btn btn-danger" 
              (click)="confirmDelete()"
              [disabled]="deleting"
            >
              <span *ngIf="deleting" class="spinner-border spinner-border-sm me-2" role="status"></span>
              <i *ngIf="!deleting" class="bx bx-trash me-1"></i>
              {{ deleting ? 'Eliminando...' : 'Eliminar Vehículo' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-content {
      border: none;
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
      border-radius: 0.5rem;
    }
    
    .modal-header {
      padding: 1.25rem 1.5rem;
      background-color: #f8f9fa;
      border-radius: 0.5rem 0.5rem 0 0;
    }
    
    .modal-body {
      padding: 2rem 1.5rem;
      line-height: 1.6;
    }
    
    .modal-footer {
      padding: 1rem 1.5rem 1.25rem;
      background-color: #f8f9fa;
      border-radius: 0 0 0.5rem 0.5rem;
    }
    
    .avatar-lg {
      width: 4rem;
      height: 4rem;
    }
    
    .avatar-title {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }
    
    .bg-warning-subtle {
      background-color: rgba(255, 193, 7, 0.1) !important;
    }
    
    .display-5 {
      font-size: 2.5rem;
    }
    
    .lh-base {
      line-height: 1.5 !important;
    }
    
    .alert {
      padding: 1rem;
      margin-bottom: 1rem;
      border: 1px solid transparent;
      border-radius: 0.375rem;
    }
    
    .alert-warning {
      color: #664d03;
      background-color: #fff3cd;
      border-color: #ffecb5;
    }
    
    .border-warning {
      border-color: #ffc107 !important;
    }
    
    /* Responsive adjustments */
    @media (max-width: 576px) {
      .modal-body {
        padding: 1.5rem 1rem;
      }
      
      .modal-header, .modal-footer {
        padding-left: 1rem;
        padding-right: 1rem;
      }
      
      .px-3 {
        padding-left: 0.5rem !important;
        padding-right: 0.5rem !important;
      }
    }
  `]
})
export class VehicleDeleteModalComponent implements OnInit, OnDestroy {
  @Input() vehicle: Vehicle | null = null;
  @Input() deleting = false;
  @Input() errorMessage: string | null = null;
  
  @Output() confirmDeleteEvent = new EventEmitter<void>();
  @Output() modalClosedEvent = new EventEmitter<void>();

  private modalInstance: any;

  ngOnInit() {
    // No inicializar modal aquí, se hace cuando se necesita
  }

  ngOnDestroy() {
    this.hideModal();
  }

  showModal() {
    if (!this.modalInstance) {
      this.modalInstance = new bootstrap.Modal(document.getElementById('vehicleDeleteModal'));
      
      // Escuchar cuando el modal se oculta
      document.getElementById('vehicleDeleteModal')?.addEventListener('hidden.bs.modal', () => {
        this.modalClosedEvent.emit();
      });
    }
    this.modalInstance.show();
  }

  hideModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
      this.modalInstance = null;
    }
  }

  confirmDelete() {
    this.confirmDeleteEvent.emit();
  }
}