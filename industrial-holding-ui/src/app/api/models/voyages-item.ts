/* tslint:disable */
/* eslint-disable */
import { OperationsItem } from './operations-item';
export interface VoyagesItem {
  endStation?: string;
  id?: number;
  operations?: Array<OperationsItem>;
  startDate?: string;
  startStation?: string;
}
