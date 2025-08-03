import { BaseEntity } from '../base.interface';

export interface Reference extends BaseEntity {
  applicationId: string;
  name: string;
  phone: string;
  relationship?: string;
  isWorkReference: boolean;
}