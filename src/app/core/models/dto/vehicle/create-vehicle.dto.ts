import { VehicleStatus } from '../../enums/vehicle-status.enum';

export interface CreateVehicleDto {
  dealerId?: string;
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
  accident?: boolean;
  accidentDescription?: string;
  accidentHistory?: string;
  previousOwners?: number;
  originalPrice: number;
  currentPrice?: number;
  minAcceptablePrice?: number;
  status?: VehicleStatus;
}