export interface PaymentCalculation {
  principal: number;
  interestRate: number;
  months: number;
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
}