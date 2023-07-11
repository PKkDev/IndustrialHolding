import { Component, OnInit } from '@angular/core';
import { WagonItem } from 'src/app/api/models';
import { TestService } from 'src/app/api/services';

@Component({
  selector: 'app-list-test-view',
  templateUrl: './list-test-view.component.html',
  styleUrls: ['./list-test-view.component.scss']
})
export class ListTestViewComponent implements OnInit {

  constructor(
    private testService: TestService
  ) { }

  ngOnInit() {

    this.testService.apiTestListGet().subscribe({
      next: (value: WagonItem[]) => {
        console.log('value', value);
      },
      error: (err) => {
        console.log('err', err);

      },
    })
  }

}
