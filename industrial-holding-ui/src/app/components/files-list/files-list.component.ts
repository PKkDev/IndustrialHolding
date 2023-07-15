import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, finalize } from 'rxjs';
import { FilesService } from 'src/app/api/services';
import { StrictHttpResponse } from 'src/app/api/strict-http-response';
import { SaveFile, parseFileName } from 'src/app/functions/save-file';
import { savedFIleModel } from './model';
import { mapFileItem } from './files-list.constants';

@Component({
  selector: 'app-files-list',
  templateUrl: './files-list.component.html',
  styleUrls: ['./files-list.component.scss']
})
export class FilesListComponent implements OnInit, OnDestroy {

  public files: savedFIleModel[] = [];

  private removeFileSubs?: Subscription;
  private loadFilesSubs?: Subscription;
  private downloadFile?: Subscription;

  public zipIsLoading = false;

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
          this.files = value.map(mapFileItem);
        },
        error: (err) => { console.error(err); },
      })
  }

  public onDownloadAllZip() {
    this.zipIsLoading = true;
    this.api.apiFilesDownloadAllZipGet$Response()
      .pipe(finalize(() => this.zipIsLoading = false))
      .subscribe({
        next: (value: StrictHttpResponse<Blob>) => {
          SaveFile(value, parseFileName(value.headers, 'file.zip'));
        },
        error: (err) => { console.error(err); },
      });
  }

  public onDownloadFile(file: savedFIleModel) {
    file.isDownloading = true;
    this.downloadFile = this.api.apiFilesDownloadFileGet$Response({ fileName: file.name })
      .pipe(finalize(() => file.isDownloading = false))
      .subscribe({
        next: (value: StrictHttpResponse<Blob>) => {
          SaveFile(value, file.name);
        },
        error: (err) => { console.error(err); },
      });
  }

  public onRemoveFile(file: savedFIleModel) {
    if (!window.confirm('точно?')) return;

    file.isDeleting = true;
    this.removeFileSubs = this.api.apiFilesRemoveGet({ fileName: file.name })
      .pipe(finalize(() => file.isDeleting = false))
      .subscribe({
        next: (value: any) => {
          this.loadFiles();
        },
        error: (err) => { console.error(err); },
      });
  }

}
