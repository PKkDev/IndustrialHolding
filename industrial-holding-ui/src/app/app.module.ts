import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component'; 
import { LayoutMainComponent } from './components/layout-main/layout-main.component';
import { HeaderComponent } from './components/header/header.component';
import { MenuComponent } from './components/menu/menu.component';
import { FilesListComponent } from './components/files-list/files-list.component';
import { FilesUploadComponent } from './components/files-upload/files-upload.component';
import { WagonListViewComponent } from './components/wagon-list-view/wagon-list-view.component';
import { WagonVoyagesViewComponent } from './components/wagon-voyages-view/wagon-voyages-view.component';
import { BreadcrumbComponent } from './components/Breadcrumb/Breadcrumb.component';
import { ByteConverterPipe } from './pipes/byte-converter.pipe';
import { HttpInterceptorProviders } from './interceptor';
import { SettingsComponent } from './components/settings/settings.component';
import { HourConverterPipe } from './pipes/hour-converter.pipe';
import { registerLocaleData } from '@angular/common';

import { NgcButtonDirective } from './directives/ngc-button.directive';
import { NgcIconDirective } from './directives/ngc-icon.directive';

import localRu from '@angular/common/locales/ru';
import { AppSettingsService } from './services/app-settings.service';
registerLocaleData(localRu);

@NgModule({
  declarations: [
    AppComponent,
    LayoutMainComponent,
    HeaderComponent,
    MenuComponent,
    WagonListViewComponent,
    FilesUploadComponent,
    FilesListComponent,
    WagonVoyagesViewComponent,
    BreadcrumbComponent,
    ByteConverterPipe,
    SettingsComponent,
    HourConverterPipe,
    NgcButtonDirective,
    NgcIconDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [AppSettingsService],
      useFactory: (appConfigService: AppSettingsService) => {
        return () => {
          return appConfigService.loadAppConfig();
        };
      }
    },
    HttpInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
