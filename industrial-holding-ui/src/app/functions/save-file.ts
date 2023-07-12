import { StrictHttpResponse } from "../api/strict-http-response";

export const SaveFile = (file: StrictHttpResponse<Blob>, fileName: string) => {
    let url = window.URL.createObjectURL(file.body);
    let a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
}