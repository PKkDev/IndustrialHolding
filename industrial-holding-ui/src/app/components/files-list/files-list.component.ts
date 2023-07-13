import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FilesService } from 'src/app/api/services';
import { StrictHttpResponse } from 'src/app/api/strict-http-response';
import { SaveFile } from 'src/app/functions/save-file';

@Component({
  selector: 'app-files-list',
  templateUrl: './files-list.component.html',
  styleUrls: ['./files-list.component.scss']
})
export class FilesListComponent implements OnInit, OnDestroy {

  public files: string[] = [];

  private removeFileSubs?: Subscription;
  private loadFilesSubs?: Subscription;
  private downloadFile?: Subscription;

  constructor(private api: FilesService) { }

  ngOnInit() {
    this.loadFiles();
  }

  ngOnDestroy() {
    this.removeFileSubs?.unsubscribe();
    this.loadFilesSubs?.unsubscribe();
    this.downloadFile?.unsubscribe();
  }

  private loadFiles() {
    this.files = [];
    this.loadFilesSubs = this.api.apiFilesListGet()
      .subscribe({
        next: (value: string[]) => {
          this.files = value;
        },
        error: (err) => { },
      })
  }

  public onDownloadFile(fileName: string) {
    this.downloadFile = this.api.apiFilesDownloadGet$Response({ fileName: fileName })
      .subscribe({
        next: (value: StrictHttpResponse<Blob>) => {
          SaveFile(value, fileName);
        },
        error: (err) => { },
      });
  }

  public onRemoveFile(fileName: string) {
    if (!window.confirm('точно?')) return;

    this.removeFileSubs = this.api.apiFilesRemoveGet({ fileName: fileName })
      .subscribe({
        next: (value: any) => {
          this.loadFiles();
        },
        error: (err) => { },
      });
  }

}
