import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WagonItem } from 'src/app/api/models';
import { TestService } from 'src/app/api/services';

@Component({
  selector: 'app-wagon-voyages-view',
  templateUrl: './wagon-voyages-view.component.html',
  styleUrls: ['./wagon-voyages-view.component.scss']
})
export class WagonVoyagesViewComponent implements OnInit {

  public wagon: WagonItem | undefined;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private testService: TestService
  ) { }

  ngOnInit() {

    const number = this.activatedRoute.snapshot.paramMap.get('number')

    this.testService.apiTestListGet().subscribe({
      next: (value: WagonItem[]) => {
        this.wagon = value.find(x => x.number == +number!);
        console.log('this.wagon', this.wagon);
      },
      error: (err) => {
        console.log('err', err);

      },
    })
  }

}
