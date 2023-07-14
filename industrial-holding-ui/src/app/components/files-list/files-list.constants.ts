import { savedFIleModel } from "./model"

export const mapFileItem = (file: string): savedFIleModel => {
    return {
        name: file,
        isDeleting: false,
        isDownloading: false
    }
}