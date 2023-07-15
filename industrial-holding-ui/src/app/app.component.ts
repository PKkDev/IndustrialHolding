import { Component, isDevMode } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ApiConfiguration } from './api/api-configuration';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(title: Title, private apiConfiguration: ApiConfiguration) {

    title.setTitle('Industrial Holding');

    // console.log(isDevMode());
    // if (isDevMode()) {
    //   apiConfiguration.rootUrl = 'https://localhost:7065';
    // } else {
    //   apiConfiguration.rootUrl = 'https://custplace.ru';
    // }

    // console.log(apiConfiguration.rootUrl);

  }
}
