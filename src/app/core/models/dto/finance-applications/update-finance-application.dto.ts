import { ApplicationStatus } from '../../enums/application-status.enum';

export interface UpdateFinanceApplicationDto {
  status?: ApplicationStatus;
  rejectionReason?: string;
  monthlyPayment?: number;
}