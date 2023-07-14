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


@Injectable({ providedIn: 'root' })
export class SettingsService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `apiSettingsRestoreDbGet()` */
  static readonly ApiSettingsRestoreDbGetPath = '/api/settings/restoreDB';

  /**
   * Пересоздать базу данных.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiSettingsRestoreDbGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiSettingsRestoreDbGet$Response(
    params?: {
    },
    context?: HttpContext
  ): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, SettingsService.ApiSettingsRestoreDbGetPath, 'get');
    if (params) {
    }

    return this.http.request(
      rb.build({ responseType: 'text', accept: '*/*', context })
    ).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Пересоздать базу данных.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiSettingsRestoreDbGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiSettingsRestoreDbGet(
    params?: {
    },
    context?: HttpContext
  ): Observable<void> {
    return this.apiSettingsRestoreDbGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

}
