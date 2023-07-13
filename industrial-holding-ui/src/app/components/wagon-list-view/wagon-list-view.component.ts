import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { WagonItem } from 'src/app/api/models';
import { TestService } from 'src/app/api/services';

@Component({
  selector: 'app-wagon-list-view',
  templateUrl: './wagon-list-view.component.html',
  styleUrls: ['./wagon-list-view.component.scss']
})
export class WagonListViewComponent implements OnInit, OnDestroy {

  public wagons: WagonItem[] = [];

  private loadDataSubs?: Subscription;

  constructor(
    private router: Router,
    private testService: TestService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    this.loadDataSubs?.unsubscribe();
  }

  private loadData() {
    this.loadDataSubs = this.testService.apiTestListGet()
      .subscribe({
        next: (value: WagonItem[]) => {
          this.wagons = value;
        },
        error: (err) => { },
      })
  }

  public onGoToVoyages(wagon: WagonItem) {
    this.router.navigate(['wagons', wagon.number])
  }

}
