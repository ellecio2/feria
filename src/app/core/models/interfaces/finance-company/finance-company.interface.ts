export interface FinanceCompany {
  id: string;
  userId: string;
  companyName: string;
  rnc: string;
  interestRate: number;
  maxFinanceMonths: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Relación con usuario (si necesitas mostrar datos del usuario)
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
  };
}