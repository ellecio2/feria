export interface RegisterFinanceCompanyDto {
  // Datos del usuario
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  
  // Datos de la financiera
  companyName: string;
  rnc: string;
  interestRate?: number;
  maxFinanceMonths?: number;
}