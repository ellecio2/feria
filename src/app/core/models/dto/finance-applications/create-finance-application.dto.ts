import { CreateCoDebtorDto } from './create-co-debtor.dto';
import { CreateReferenceDto } from './create-reference.dto';

export interface CreateFinanceApplicationDto {
  clientId: string;
  vehicleId: string;
  financeCompanyId: string;
  requestedAmount: number;
  downPayment?: number;
  financeMonths: number;
  coDebtors?: CreateCoDebtorDto[];
  references?: CreateReferenceDto[];
}