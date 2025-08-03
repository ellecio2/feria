import { BaseEntity } from '../base.interface';

export interface CoDebtor extends BaseEntity {
  applicationId: string;
  firstName: string;
  lastName: string;
  cedula: string;
  phone?: string;
  relationship?: string;
  monthlyIncome?: number;
}