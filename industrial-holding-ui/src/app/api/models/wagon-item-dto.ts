/* tslint:disable */
/* eslint-disable */
import { LastVoyagesItemDto } from './last-voyages-item-dto';
import { WagonItemStatus } from './wagon-item-status';
export interface WagonItemDto {
  id?: number;
  lastWay?: LastVoyagesItemDto;
  number?: number;
  order?: number;
  status?: WagonItemStatus;
  statusTxt?: string;
  voyages?: number;
}
