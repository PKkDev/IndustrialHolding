import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../model/app-settings';
import { firstValueFrom, map } from 'rxjs';
import { ApiConfiguration } from '../api/api-configuration';

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {

  private appConfig: AppSettings | undefined;

  constructor(private http: HttpClient, private apiConfiguration: ApiConfiguration) { }

  loadAppConfig() {
    const req = this.http.get<AppSettings>('assets/config/appsettings.json')
      .pipe(map((data: AppSettings) => {
        console.log('AppSettings', data);
        this.apiConfiguration.rootUrl = data.apiBaseUrl;
        this.appConfig = data;
        return data;
      }))
    return firstValueFrom(req)
  }

  get apiBaseUrl() {
    if (!this.appConfig)
      throw Error('Config file not loaded!');

    return this.appConfig.apiBaseUrl;
  }

}
