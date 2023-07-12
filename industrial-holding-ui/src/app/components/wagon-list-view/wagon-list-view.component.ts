import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WagonItem } from 'src/app/api/models';
import { TestService } from 'src/app/api/services';

@Component({
  selector: 'app-wagon-list-view',
  templateUrl: './wagon-list-view.component.html',
  styleUrls: ['./wagon-list-view.component.scss']
})
export class WagonListViewComponent implements OnInit {

  public wagons: WagonItem[] = [];

  constructor(
    private router: Router,
    private testService: TestService
  ) { }

  ngOnInit() {

    this.testService.apiTestListGet().subscribe({
      next: (value: WagonItem[]) => {
        this.wagons = value;
        console.log('value', value);
      },
      error: (err) => {
        console.log('err', err);

      },
    })
  }

  public onGoToVoyages(wagon: WagonItem) {
    this.router.navigate(['wagons', wagon.number])
  }

}
