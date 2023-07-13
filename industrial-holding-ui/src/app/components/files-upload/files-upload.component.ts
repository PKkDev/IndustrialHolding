import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FilesService } from 'src/app/api/services';
import { firstValueFrom } from 'rxjs';
import { ApiError } from 'src/app/interceptor/model';
import { FileUploadModel, FileUploadState } from './model';

@Component({
  selector: 'app-files-upload',
  templateUrl: './files-upload.component.html',
  styleUrls: ['./files-upload.component.scss']
})
export class FilesUploadComponent implements OnInit {

  @ViewChild('fileInput') fileInput: ElementRef | undefined;

  public files: FileUploadModel[] = [];

  constructor(private api: FilesService) { }

  ngOnInit() { }

  public onSelectFile() {
    this.fileInput?.nativeElement.click();
  }

  public onFileSelectorChange(event: any) {
    this.files = [];
    const files = event.target.files;
    for (const file of files) {
      this.files.push({
        file: file,
        state: FileUploadState.Wait,
      });
    }
  }

  public async onSendAllFile() {
    for (const file of this.files) {
      if (file.state != FileUploadState.Done)
        await this.onSendFile(file);
    }
  }

  public async onSendFile(file: FileUploadModel) {
    file.state = FileUploadState.InProcess;
    const request = this.api.apiFilesUploadPost({
      body: { files: [file.file] }
    });
    await firstValueFrom(request)
      .then(value => {
        file.state = FileUploadState.Done;
        console.log(value);
      })
      .catch((error: ApiError) => {
        file.state = FileUploadState.Error;
        file.error = error.detail;
      });

  }

}
