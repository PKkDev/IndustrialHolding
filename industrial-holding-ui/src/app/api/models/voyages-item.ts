/* tslint:disable */
/* eslint-disable */
import { OperationsItem } from './operations-item';
export interface VoyagesItem {
  endStation?: null | string;
  operations?: Array<OperationsItem>;
  startDate?: string;
  startStation?: string;
}
