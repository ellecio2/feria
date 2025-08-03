import { BaseEntity } from '../base.interface';
import { ApplicationStatus } from '../../enums/application-status.enum';
import { Client } from '../client/client.interface';
import { Vehicle } from '../vehicle/vehicles.interface';
import { FinanceCompany } from '../finance-company/finance-company.interface';
import { CoDebtor } from './co-debtor.interface';
import { Reference } from './reference.interface';

export interface FinanceApplication extends BaseEntity {
  clientId: string;
  client?: Client;
  vehicleId: string;
  vehicle?: Vehicle;
  financeCompanyId: string;
  financeCompany?: FinanceCompany;
  requestedAmount: number;
  downPayment: number;
  financeMonths: number;
  monthlyPayment?: number;
  status: ApplicationStatus;
  rejectionReason?: string;
  metadata?: any;
  coDebtors?: CoDebtor[];
  references?: Reference[];
}