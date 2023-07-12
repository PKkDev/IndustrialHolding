import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutMainComponent } from './components/layout-main/layout-main.component';
import { FilesListComponent } from './components/files-list/files-list.component';
import { FilesUploadComponent } from './components/files-upload/files-upload.component';
import { WagonListViewComponent } from './components/wagon-list-view/wagon-list-view.component';
import { WagonVoyagesViewComponent } from './components/wagon-voyages-view/wagon-voyages-view.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutMainComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'wagons'
      },
      {
        path: 'wagons',
        component: WagonListViewComponent
      },
      {
        path: 'wagons/:number',
        component: WagonVoyagesViewComponent
      },
      {
        path: 'files-upload',
        component: FilesUploadComponent
      },
      {
        path: 'files-list',
        component: FilesListComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
