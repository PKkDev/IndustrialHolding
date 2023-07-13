import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable, catchError, throwError } from "rxjs";
import { ApiError } from "./model";

export class ErrorInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(req)
            .pipe(catchError((httpEx: HttpErrorResponse) => {
                console.log('HttpErrorResponse', httpEx);

                const apiEx: ApiError = new ApiError(httpEx.status);

                if (httpEx.error) {

                    const exError = httpEx.error;

                    if (typeof exError == 'object') {
                        apiEx.detail = exError.detail || apiEx.detail;
                        apiEx.title = exError.title || apiEx.title;
                        apiEx.status = exError.status || apiEx.status;
                    }

                    if (typeof exError == 'string') {
                        try {
                            const exErrorObj: ApiError = JSON.parse(exError);
                            apiEx.detail = exErrorObj.detail;
                            apiEx.title = exErrorObj.title;
                            apiEx.status = exErrorObj.status;
                        } catch (error) {
                            console.error(error);
                        }
                    }
                }

                console.log('new HttpErrorResponse', apiEx);
                return throwError(() => apiEx)
            }));
    }

}