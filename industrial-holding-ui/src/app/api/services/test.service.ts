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

import { WagonItem } from '../models/wagon-item';

@Injectable({ providedIn: 'root' })
export class TestService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `apiTestListGet()` */
  static readonly ApiTestListGetPath = '/api/test/list';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiTestListGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiTestListGet$Response(
    params?: {
    },
    context?: HttpContext
  ): Observable<StrictHttpResponse<Array<WagonItem>>> {
    const rb = new RequestBuilder(this.rootUrl, TestService.ApiTestListGetPath, 'get');
    if (params) {
    }

    return this.http.request(
      rb.build({ responseType: 'json', accept: 'application/json', context })
    ).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<WagonItem>>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiTestListGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiTestListGet(
    params?: {
    },
    context?: HttpContext
  ): Observable<Array<WagonItem>> {
    return this.apiTestListGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<WagonItem>>): Array<WagonItem> => r.body)
    );
  }

  /** Path part for operation `apiTestParsePost()` */
  static readonly ApiTestParsePostPath = '/api/test/parse';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiTestParsePost()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiTestParsePost$Response(
    params?: {
      body?: {
'file'?: Blob;
}
    },
    context?: HttpContext
  ): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, TestService.ApiTestParsePostPath, 'post');
    if (params) {
      rb.body(params.body, 'multipart/form-data');
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
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiTestParsePost$Response()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiTestParsePost(
    params?: {
      body?: {
'file'?: Blob;
}
    },
    context?: HttpContext
  ): Observable<void> {
    return this.apiTestParsePost$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

}
