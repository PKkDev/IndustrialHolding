import { Component, OnInit } from '@angular/core';
import { FilesService } from 'src/app/api/services';
import { StrictHttpResponse } from 'src/app/api/strict-http-response';
import { SaveFile } from 'src/app/functions/save-file';

@Component({
  selector: 'app-files-list',
  templateUrl: './files-list.component.html',
  styleUrls: ['./files-list.component.scss']
})
export class FilesListComponent implements OnInit {

  public files: string[] = [];

  constructor(private api: FilesService) { }

  ngOnInit() {
    this.api.apiFilesListGet()
      .subscribe({
        next: (value: string[]) => {
          this.files = value;
        },
        error: (err) => {

        },
      })
  }

  public onDownloadFile(fileName: string) {
    this.api.apiFilesDownloadGet$Response({ fileName: fileName }).subscribe({
      next: (value: StrictHttpResponse<Blob>) => {
        SaveFile(value, fileName);
      },
      error: (err) => {

      },
    });
  }

}
