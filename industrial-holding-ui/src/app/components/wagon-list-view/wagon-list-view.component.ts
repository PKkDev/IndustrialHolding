import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { WagonItemDto } from 'src/app/api/models';
import { WagonService } from 'src/app/api/services';

@Component({
  selector: 'app-wagon-list-view',
  templateUrl: './wagon-list-view.component.html',
  styleUrls: ['./wagon-list-view.component.scss']
})
export class WagonListViewComponent implements OnInit, OnDestroy {

  public wagons: WagonItemDto[] = [];

  private loadDataSubs?: Subscription;

  constructor(
    private router: Router,
    private api: WagonService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    this.loadDataSubs?.unsubscribe();
  }

  private loadData() {
    this.loadDataSubs = this.api.apiWagonWagonListGet()
      .subscribe({
        next: (value: WagonItemDto[]) => {
          this.wagons = value;
        },
        error: (err) => { },
      })
  }

  public onGoToVoyages(wagon: WagonItemDto) {
    this.router.navigate(['wagons', wagon.number])
  }

}
