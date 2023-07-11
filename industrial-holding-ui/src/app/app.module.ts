import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApiModule } from './api/api.module';
import { ListTestViewComponent } from './components/list-test-view/list-test-view.component';

@NgModule({
  declarations: [
    AppComponent,
    ListTestViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ApiModule.forRoot({ rootUrl: 'https://localhost:7065' }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
