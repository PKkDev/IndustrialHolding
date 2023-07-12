import { Component, OnInit } from '@angular/core';
import { EventType, Router } from '@angular/router';

interface BreadcrumbItem {
  title: string;
  path?: string;
  isActive: boolean
}

@Component({
  selector: 'app-Breadcrumb',
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
        title: urlTitleMap[arr[i]] ?? arr[i],
        path: urlPthMap[arr[i]],
        isActive: i == arr.length - 1
      })
    }
    console.log(this.breadcrumbs);
  }

}

const urlTitleMap: Record<string, string> = {
  '': 'Главная',
  'wagons': 'Вагоны',
  'files-upload': 'Загрузка файлов',
  'files-list': 'Загруженные файлы'
}

const urlPthMap: Record<string, string> = {
  '': 'wagons',
  'wagons': 'wagons',
}
