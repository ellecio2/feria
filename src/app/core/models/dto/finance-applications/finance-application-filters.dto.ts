import { ApplicationStatus } from '../../enums/application-status.enum';

export interface FinanceApplicationFilters {
  status?: ApplicationStatus;
  financeCompanyId?: string;
  clientId?: string;
  vehicleId?: string;
  fromDate?: string;
  toDate?: string;
}