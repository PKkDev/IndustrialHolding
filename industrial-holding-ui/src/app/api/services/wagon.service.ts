/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';

import { VoyagesItemDto } from '../models/voyages-item-dto';
import { WagonItemDto } from '../models/wagon-item-dto';

@Injectable({ providedIn: 'root' })
export class WagonService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `apiWagonWagonListGet()` */
  static readonly ApiWagonWagonListGetPath = '/api/wagon/wagon-list';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiWagonWagonListGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiWagonWagonListGet$Response(
    params?: {
    },
    context?: HttpContext
  ): Observable<StrictHttpResponse<Array<WagonItemDto>>> {
    const rb = new RequestBuilder(this.rootUrl, WagonService.ApiWagonWagonListGetPath, 'get');
    if (params) {
    }

    return this.http.request(
      rb.build({ responseType: 'json', accept: 'application/json', context })
    ).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<WagonItemDto>>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiWagonWagonListGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiWagonWagonListGet(
    params?: {
    },
    context?: HttpContext
  ): Observable<Array<WagonItemDto>> {
    return this.apiWagonWagonListGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<WagonItemDto>>): Array<WagonItemDto> => r.body)
    );
  }

  /** Path part for operation `apiWagonWayListGet()` */
  static readonly ApiWagonWayListGetPath = '/api/wagon/way-list';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiWagonWayListGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiWagonWayListGet$Response(
    params?: {
      wagonNumber?: number;
    },
    context?: HttpContext
  ): Observable<StrictHttpResponse<Array<VoyagesItemDto>>> {
    const rb = new RequestBuilder(this.rootUrl, WagonService.ApiWagonWayListGetPath, 'get');
    if (params) {
      rb.query('wagonNumber', params.wagonNumber, {"style":"form"});
    }

    return this.http.request(
      rb.build({ responseType: 'json', accept: 'application/json', context })
    ).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<VoyagesItemDto>>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiWagonWayListGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiWagonWayListGet(
    params?: {
      wagonNumber?: number;
    },
    context?: HttpContext
  ): Observable<Array<VoyagesItemDto>> {
    return this.apiWagonWayListGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<VoyagesItemDto>>): Array<VoyagesItemDto> => r.body)
    );
  }

}
