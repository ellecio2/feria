import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { 
  FinanceApplication, 
  CreateFinanceApplicationDto, 
  UpdateFinanceApplicationDto,
  FinanceApplicationFilters,
  ApplicationStatus
} from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class FinanceApplicationsService {
  private readonly endpoint = `${environment.apiUrl}/finance-applications`;

  constructor(private http: HttpClient) {}

  // Crear nueva aplicación de financiamiento
  create(createDto: CreateFinanceApplicationDto): Observable<FinanceApplication> {
    return this.http.post<FinanceApplication>(this.endpoint, createDto);
  }

  // Obtener todas las aplicaciones (con filtros opcionales)
  getAll(filters?: FinanceApplicationFilters): Observable<FinanceApplication[]> {
    let params = new HttpParams();
    
    if (filters?.status) {
      params = params.set('status', filters.status);
    }
    if (filters?.financeCompanyId) {
      params = params.set('financeCompanyId', filters.financeCompanyId);
    }
    if (filters?.clientId) {
      params = params.set('clientId', filters.clientId);
    }
    if (filters?.vehicleId) {
      params = params.set('vehicleId', filters.vehicleId);
    }
    if (filters?.fromDate) {
      params = params.set('fromDate', filters.fromDate);
    }
    if (filters?.toDate) {
      params = params.set('toDate', filters.toDate);
    }

    return this.http.get<FinanceApplication[]>(this.endpoint, { params });
  }

  // Obtener aplicación por ID
  getById(id: string): Observable<FinanceApplication> {
    return this.http.get<FinanceApplication>(`${this.endpoint}/${id}`);
  }

  // Obtener aplicación con todos los detalles
  getWithDetails(id: string): Observable<FinanceApplication> {
    return this.http.get<FinanceApplication>(`${this.endpoint}/${id}/details`);
  }

  // Actualizar aplicación
  update(id: string, updateDto: UpdateFinanceApplicationDto): Observable<FinanceApplication> {
    return this.http.patch<FinanceApplication>(`${this.endpoint}/${id}`, updateDto);
  }

  // Eliminar aplicación
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }

  // Aprobar aplicación
  approve(id: string, monthlyPayment?: number): Observable<FinanceApplication> {
    const updateDto: UpdateFinanceApplicationDto = {
      status: ApplicationStatus.APROBADA,
      monthlyPayment
    };
    return this.update(id, updateDto);
  }

  // Rechazar aplicación
  reject(id: string, rejectionReason: string): Observable<FinanceApplication> {
    const updateDto: UpdateFinanceApplicationDto = {
      status: ApplicationStatus.RECHAZADA,
      rejectionReason
    };
    return this.update(id, updateDto);
  }

  // Marcar como en revisión
  markAsReview(id: string): Observable<FinanceApplication> {
    const updateDto: UpdateFinanceApplicationDto = {
      status: ApplicationStatus.EN_REVISION
    };
    return this.update(id, updateDto);
  }

  // Solicitar documentos pendientes
  requestDocuments(id: string, rejectionReason?: string): Observable<FinanceApplication> {
    const updateDto: UpdateFinanceApplicationDto = {
      status: ApplicationStatus.DOCUMENTOS_PENDIENTES,
      rejectionReason
    };
    return this.update(id, updateDto);
  }

  // Obtener aplicaciones por estado
  getByStatus(status: ApplicationStatus): Observable<FinanceApplication[]> {
    return this.getAll({ status });
  }

  // Obtener aplicaciones de una financiera específica
  getByFinanceCompany(financeCompanyId: string): Observable<FinanceApplication[]> {
    return this.getAll({ financeCompanyId });
  }

  // Obtener aplicaciones de un cliente específico
  getByClient(clientId: string): Observable<FinanceApplication[]> {
    return this.getAll({ clientId });
  }

  // Obtener aplicaciones para un vehículo específico
  getByVehicle(vehicleId: string): Observable<FinanceApplication[]> {
    return this.getAll({ vehicleId });
  }
}