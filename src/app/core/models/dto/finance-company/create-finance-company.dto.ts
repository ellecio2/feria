export interface CreateFinanceCompanyDto {
  userId: string;
  companyName: string;
  rnc: string;
  interestRate?: number;
  maxFinanceMonths?: number;
}