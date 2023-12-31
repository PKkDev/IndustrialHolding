import { HttpHeaders } from "@angular/common/http";
import { StrictHttpResponse } from "../api/strict-http-response";

export const parseFileName = (headers: HttpHeaders, nameDef: string): string => {
    let fileName = nameDef;

    const disposition = headers.get('content-disposition');
  
    if (disposition) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) {
            fileName = matches[1].replace(/['"]/g, '');
        }
    }

    return fileName;
}

export const SaveFile = (file: StrictHttpResponse<Blob>, fileName: string) => {
    const url = window.URL.createObjectURL(file.body);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
}