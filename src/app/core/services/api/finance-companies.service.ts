import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  FinanceCompany, 
  CreateFinanceCompanyDto, 
  UpdateFinanceCompanyDto, 
  RegisterFinanceCompanyDto,
  PaymentCalculation 
} from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class FinanceCompaniesService {
  private endpoint = '/api/finance-companies';

  constructor(private http: HttpClient) {}

  // Registrar nueva financiera (público)
  register(registerDto: RegisterFinanceCompanyDto): Observable<FinanceCompany> {
    return this.http.post<FinanceCompany>(`${this.endpoint}/register`, registerDto);
  }

  // Crear financiera (solo admin)
  create(createDto: CreateFinanceCompanyDto): Observable<FinanceCompany> {
    return this.http.post<FinanceCompany>(this.endpoint, createDto);
  }

  // Obtener todas las financieras
  getAll(): Observable<FinanceCompany[]> {
    return this.http.get<FinanceCompany[]>(this.endpoint);
  }

  // Calcular cuota mensual (público)
  calculatePayment(principal: number, interestRate: number, months: number): Observable<PaymentCalculation> {
    const params = new HttpParams()
      .set('principal', principal)
      .set('interestRate', interestRate)
      .set('months', months);
    return this.http.get<PaymentCalculation>(`${this.endpoint}/calculate-payment`, { params });
  }

  // Obtener info de la financiera actual (rol financiera)
  getMe(): Observable<FinanceCompany> {
    return this.http.get<FinanceCompany>(`${this.endpoint}/me`);
  }

  // Obtener financiera por ID
  getById(id: string): Observable<FinanceCompany> {
    return this.http.get<FinanceCompany>(`${this.endpoint}/${id}`);
  }

  // Actualizar financiera
  update(id: string, updateDto: UpdateFinanceCompanyDto): Observable<FinanceCompany> {
    return this.http.patch<FinanceCompany>(`${this.endpoint}/${id}`, updateDto);
  }

  // Eliminar financiera
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}