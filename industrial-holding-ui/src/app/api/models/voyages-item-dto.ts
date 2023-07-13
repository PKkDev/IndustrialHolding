/* tslint:disable */
/* eslint-disable */
import { OperationsItemDto } from './operations-item-dto';
export interface VoyagesItemDto {
  endStation?: string;
  id?: number;
  operations?: Array<OperationsItemDto>;
  startDate?: string;
  startStation?: string;
}
