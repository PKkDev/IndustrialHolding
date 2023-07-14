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
export class FilesService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `apiFilesListGet()` */
  static readonly ApiFilesListGetPath = '/api/files/list';

  /**
   * Получить список всех загруженных файлов.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiFilesListGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiFilesListGet$Response(
    params?: {
    },
    context?: HttpContext
  ): Observable<StrictHttpResponse<Array<string>>> {
    const rb = new RequestBuilder(this.rootUrl, FilesService.ApiFilesListGetPath, 'get');
    if (params) {
    }

    return this.http.request(
      rb.build({ responseType: 'json', accept: 'application/json', context })
    ).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<string>>;
      })
    );
  }

  /**
   * Получить список всех загруженных файлов.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiFilesListGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiFilesListGet(
    params?: {
    },
    context?: HttpContext
  ): Observable<Array<string>> {
    return this.apiFilesListGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<string>>): Array<string> => r.body)
    );
  }

  /** Path part for operation `apiFilesDownloadFileGet()` */
  static readonly ApiFilesDownloadFileGetPath = '/api/files/download/file';

  /**
   * Загрузить файл с срвера.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiFilesDownloadFileGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiFilesDownloadFileGet$Response(
    params?: {

      /**
       * Имя файла
       */
      fileName?: string;
    },
    context?: HttpContext
  ): Observable<StrictHttpResponse<Blob>> {
    const rb = new RequestBuilder(this.rootUrl, FilesService.ApiFilesDownloadFileGetPath, 'get');
    if (params) {
      rb.query('fileName', params.fileName, { "style": "form" });
    }

    return this.http.request(
      rb.build({ responseType: 'blob', accept: 'application/octet-stream', context })
    ).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Blob>;
      })
    );
  }

  /**
   * Загрузить файл с срвера.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiFilesDownloadFileGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiFilesDownloadFileGet(
    params?: {

      /**
       * Имя файла
       */
      fileName?: string;
    },
    context?: HttpContext
  ): Observable<Blob> {
    return this.apiFilesDownloadFileGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<Blob>): Blob => r.body)
    );
  }

  /** Path part for operation `apiFilesDownloadAllZipGet()` */
  static readonly ApiFilesDownloadAllZipGetPath = '/api/files/download/all/zip';

  /**
   * Загрузить все фйлы с сервера в формате .zip.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiFilesDownloadAllZipGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiFilesDownloadAllZipGet$Response(
    params?: {
    },
    context?: HttpContext
  ): Observable<StrictHttpResponse<Blob>> {
    const rb = new RequestBuilder(this.rootUrl, FilesService.ApiFilesDownloadAllZipGetPath, 'get');
    if (params) {
    }

    return this.http.request(
      rb.build({ responseType: 'blob', accept: 'application/zip', context })
    ).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Blob>;
      })
    );
  }

  /**
   * Загрузить все фйлы с сервера в формате .zip.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiFilesDownloadAllZipGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiFilesDownloadAllZipGet(
    params?: {
    },
    context?: HttpContext
  ): Observable<Blob> {
    return this.apiFilesDownloadAllZipGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<Blob>): Blob => r.body)
    );
  }

  /** Path part for operation `apiFilesRemoveGet()` */
  static readonly ApiFilesRemoveGetPath = '/api/files/remove';

  /**
   * Удаление файла с сервера.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiFilesRemoveGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiFilesRemoveGet$Response(
    params?: {

      /**
       * Имя файла
       */
      fileName?: string;
    },
    context?: HttpContext
  ): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, FilesService.ApiFilesRemoveGetPath, 'get');
    if (params) {
      rb.query('fileName', params.fileName, { "style": "form" });
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
   * Удаление файла с сервера.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiFilesRemoveGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiFilesRemoveGet(
    params?: {

      /**
       * Имя файла
       */
      fileName?: string;
    },
    context?: HttpContext
  ): Observable<void> {
    return this.apiFilesRemoveGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `apiFilesUploadPost()` */
  static readonly ApiFilesUploadPostPath = '/api/files/upload';

  /**
   * Загрузить файл на сервер для обработки.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiFilesUploadPost()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiFilesUploadPost$Response(
    params?: {
      body?: {
        'files'?: Array<Blob>;
      }
    },
    context?: HttpContext
  ): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, FilesService.ApiFilesUploadPostPath, 'post');
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
   * Загрузить файл на сервер для обработки.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiFilesUploadPost$Response()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiFilesUploadPost(
    params?: {
      body?: {
        'files'?: Array<Blob>;
      }
    },
    context?: HttpContext
  ): Observable<void> {
    return this.apiFilesUploadPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

}
