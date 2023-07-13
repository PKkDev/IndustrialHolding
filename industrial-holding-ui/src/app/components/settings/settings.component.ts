import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SettingsService } from 'src/app/api/services';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {

  private clearDBSubs?: Subscription;

  constructor(private api: SettingsService) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.clearDBSubs?.unsubscribe();
  }

  public onClearDB() {
    if (!window.confirm('точно?')) return;
    if (!window.confirm('все данные будут удалены, продолжить?')) return;

    this.clearDBSubs = this.api.apiSettingsGet()
      .subscribe({
        next: (value: any) => { },
        error: (err) => { },
      })
  }

}
