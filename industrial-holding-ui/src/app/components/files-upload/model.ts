export interface FileUploadModel {
    state: FileUploadState,
    file: File
    error?: string
}

export enum FileUploadState {
    Done = 0,
    Error = 1,
    InProcess = 2,
    Wait = 3
}