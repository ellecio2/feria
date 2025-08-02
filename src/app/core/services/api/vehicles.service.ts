import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/* Core - Interfaces - DTO - Enums*/
import { Vehicle, VehicleStatus, VehicleImage, CreateVehicleDto, UpdateVehicleDto, AddImageDto  } from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class VehiclesService {
  private endpoint = '/api/vehicles';

  constructor(private http: HttpClient) {}

  // Obtener todos los vehículos (filtrados por usuario)
  getAll(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.endpoint);
  }

  // Obtener vehículo por ID
  getById(id: string): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.endpoint}/${id}`);
  }

  // Obtener vehículo público (incrementa contador de escaneos)
  getByIdPublic(id: string): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.endpoint}/${id}/public`);
  }

  // Obtener vehículos por dealer
  getByDealer(dealerId: string): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.endpoint}/dealer/${dealerId}`);
  }

  // Crear nuevo vehículo
  create(vehicleData: CreateVehicleDto): Observable<Vehicle> {
    return this.http.post<Vehicle>(this.endpoint, vehicleData);
  }

  // Actualizar vehículo
  update(id: string, vehicleData: UpdateVehicleDto): Observable<Vehicle> {
    return this.http.patch<Vehicle>(`${this.endpoint}/${id}`, vehicleData);
  }

  // Eliminar vehículo
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }

  // Actualizar estado del vehículo
  updateStatus(id: string, status: VehicleStatus): Observable<Vehicle> {
    return this.http.patch<Vehicle>(`${this.endpoint}/${id}/status`, { status });
  }
}
