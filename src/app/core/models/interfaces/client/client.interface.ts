import { BaseEntity } from '../base.interface';

export interface Client extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  cedula?: string;
  address?: string;
  monthlyIncome?: number;
  workPlace?: string;
  workPosition?: string;
  workPhone?: string;
  isActive: boolean;
}