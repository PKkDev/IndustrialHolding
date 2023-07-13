import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApiModule } from './api/api.module';
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
    ByteConverterPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ApiModule.forRoot({ rootUrl: 'https://localhost:7065' }),
  ],
  providers: [
    HttpInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
