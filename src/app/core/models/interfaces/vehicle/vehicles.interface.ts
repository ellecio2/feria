import { VehicleStatus } from '../../enums/vehicle-status.enum';

export interface Vehicle {
  id: string;
  dealerId: string;
  dealer?: {
    id: string;
    name: string;
  };
  brand: string;
  model: string;
  year: number;
  color?: string;
  fuelType?: string;
  transmission?: string;
  engine?: string;
  doors?: number;
  seats?: number;
  mileage: number;
  plate?: string;
  condition: string;
  description?: string;
  accident?: boolean; // ✅ Nuevo campo
  accidentDescription?: string; // ✅ Nuevo campo
  accidentHistory?: string; // ✅ Mantener para compatibilidad
  previousOwners?: number;
  originalPrice: number;
  currentPrice?: number;
  minAcceptablePrice?: number;
  status: VehicleStatus;
  qrCode?: string;
  viewsCount: number;
  scansCount: number;
  createdAt?: string;
  updatedAt?: string;
  
  // Getter para compatibilidad hacia atrás (opcional)
  price?: number;
}