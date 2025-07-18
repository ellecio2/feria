import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Vehicle {
  id: string;
  dealerId: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  price: number;
  status: string;
  qrCode?: string;
  viewsCount: number;
  scansCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class VehiclesService {
  private endpoint = '/api/vehicles';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.endpoint);
  }

  getById(id: string): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.endpoint}/${id}`);
  }

  create(vehicle: Partial<Vehicle>): Observable<Vehicle> {
    return this.http.post<Vehicle>(this.endpoint, vehicle);
  }

  update(id: string, vehicle: Partial<Vehicle>): Observable<Vehicle> {
    return this.http.patch<Vehicle>(`${this.endpoint}/${id}`, vehicle);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }

  // Métodos adicionales específicos de vehículos
  getByDealer(dealerId: string): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.endpoint}/dealer/${dealerId}`);
  }

  generateQR(id: string): Observable<{qrCode: string}> {
    return this.http.post<{qrCode: string}>(`${this.endpoint}/${id}/generate-qr`, {});
  }

  updateStatus(id: string, status: string): Observable<Vehicle> {
    return this.http.patch<Vehicle>(`${this.endpoint}/${id}/status`, { status });
  }
}
