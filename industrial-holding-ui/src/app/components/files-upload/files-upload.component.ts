import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FilesService } from 'src/app/api/services';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-files-upload',
  templateUrl: './files-upload.component.html',
  styleUrls: ['./files-upload.component.scss']
})
export class FilesUploadComponent implements OnInit {

  @ViewChild('fileInput') fileInput: ElementRef | undefined;

  public files: File[] = [];

  constructor(private api: FilesService) { }

  ngOnInit() {
  }

  public onSelectFile() {
    this.fileInput?.nativeElement.click();
  }

  public onFileSelectorChange(event: any) {
    this.files = [];
    const files = event.target.files;
    for (const file of files) {
      this.files.push(file);
    }
  }

  public async onSendFile() {
    for (const file of this.files) {
      const request = this.api.apiFilesUploadPost({
        body: { files: [file] }
      });
      await firstValueFrom(request)
        .then(value => {
          console.log(value);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

}
