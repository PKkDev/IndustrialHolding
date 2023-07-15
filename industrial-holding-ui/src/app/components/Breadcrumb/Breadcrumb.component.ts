import { Component, OnInit } from '@angular/core';
import { EventType, Router } from '@angular/router';
import { URL_PATH_MAP, URL_TITLE_MAP } from './Breadcrumb.constants';
import { BreadcrumbItem } from './model';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './Breadcrumb.component.html',
  styleUrls: ['./Breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  public breadcrumbs: BreadcrumbItem[] = [];

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
    this.mapRoute(this.router.url);

    this.router.events.subscribe((event) => {
      if (event.type == EventType.NavigationEnd) {
        this.mapRoute(event.url);
      }
    })
  }

  private mapRoute(url: string) {
    this.breadcrumbs = [];
    const arr = url.split('/');

    for (let i = 0; i < arr.length; i++) {
      this.breadcrumbs.push({
        title: URL_TITLE_MAP[arr[i]] ?? arr[i],
        path: URL_PATH_MAP[arr[i]],
        isActive: i == arr.length - 1
      })
    }
  }

}


