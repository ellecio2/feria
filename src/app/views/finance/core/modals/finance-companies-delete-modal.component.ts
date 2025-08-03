import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceCompany } from '@core/models';

declare const bootstrap: any;

@Component({
  selector: 'app-finance-companies-delete-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Delete Confirmation Modal -->
    <div class="modal fade" id="financeCompanyDeleteModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title">
              <i class="bx bx-error-circle text-warning me-2"></i>
              Confirmar Eliminación
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
          </div>
          <div class="modal-body text-center py-4">
            <div *ngIf="company">
              <!-- Warning Icon -->
              <div class="mb-4">
                <div class="warning-icon-container mx-auto mb-3">
                  <i class="bx bx-error-circle text-warning display-1"></i>
                </div>
                <h5 class="mb-3 text-dark">¿Está seguro de que desea eliminar esta financiera?</h5>
              </div>
              
              <!-- Company Info Card -->
              <div class="company-info-card bg-warning-subtle border border-warning rounded p-3 mb-4">
                <div class="d-flex align-items-center">
                  <!-- Finance Icon -->
                  <div class="flex-shrink-0 me-3">
                    <div class="company-icon bg-warning text-white rounded d-flex align-items-center justify-content-center">
                      <i class="bx bx-dollar-circle fs-4"></i>
                    </div>
                  </div>
                  <div class="flex-grow-1 text-start">
                    <h6 class="mb-1 text-warning fw-semibold">
                      {{ company.companyName }}
                    </h6>
                    <small class="text-muted d-block">RNC: {{ company.rnc }}</small>
                    <small class="text-muted">Esta acción no se puede deshacer</small>
                  </div>
                </div>
              </div>
              
              <!-- Warning Text -->
              <div class="px-3 mb-4">
                <p class="text-muted mb-3 lh-base">
                  Se eliminarán todos los datos asociados a la financiera, incluyendo aplicaciones de financiamiento, configuraciones de tasas y cualquier información relacionada.
                </p>
              </div>
              
              <!-- Error Message in Modal -->
              <div *ngIf="errorMessage" class="alert alert-danger" role="alert">
                <i class="bx bx-error-circle me-2"></i>
                {{ errorMessage }}
              </div>
            </div>
          </div>
          <div class="modal-footer border-0 px-4 pb-4">
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
              {{ deleting ? 'Eliminando...' : 'Eliminar Financiera' }}
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
      border-radius: 0.75rem;
    }
    
    .modal-header {
      padding: 1.5rem 1.5rem 0;
    }
    
    .modal-body {
      padding: 1rem 1.5rem;
    }
    
    .modal-footer {
      padding: 0 1.5rem 1.5rem;
    }
    
    .warning-icon-container {
      width: 5rem;
      height: 5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 193, 7, 0.1);
      border-radius: 50%;
    }
    
    .company-info-card {
      background-color: rgba(255, 193, 7, 0.1) !important;
    }
    
    .company-icon {
      width: 2.5rem;
      height: 2.5rem;
      font-size: 1.25rem;
    }
    
    .bg-warning-subtle {
      background-color: rgba(255, 193, 7, 0.1) !important;
    }
    
    .display-1 {
      font-size: 4rem;
    }
    
    .lh-base {
      line-height: 1.5 !important;
    }
    
    .fw-semibold {
      font-weight: 600 !important;
    }
    
    .modal-title {
      font-weight: 600;
      color: #495057;
    }
    
    @media (max-width: 576px) {
      .modal-body {
        padding: 1rem;
      }
      
      .modal-header, .modal-footer {
        padding-left: 1rem;
        padding-right: 1rem;
      }
      
      .warning-icon-container {
        width: 4rem;
        height: 4rem;
      }
      
      .display-1 {
        font-size: 3rem;
      }
      
      .px-3 {
        padding-left: 0.5rem !important;
        padding-right: 0.5rem !important;
      }
    }
  `]
})
export class FinanceCompaniesDeleteModalComponent implements OnInit, OnDestroy {
  @Input() company: FinanceCompany | null = null;
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
      this.modalInstance = new bootstrap.Modal(document.getElementById('financeCompanyDeleteModal'));
      
      // Escuchar cuando el modal se oculta
      document.getElementById('financeCompanyDeleteModal')?.addEventListener('hidden.bs.modal', () => {
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