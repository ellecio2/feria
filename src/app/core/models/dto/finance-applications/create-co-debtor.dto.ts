export interface CreateCoDebtorDto {
  firstName: string;
  lastName: string;
  cedula: string;
  phone?: string;
  relationship?: string;
  monthlyIncome?: number;
}