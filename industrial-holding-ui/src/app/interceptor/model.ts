export class ApiError {
    public detail: string;
    public status: number;
    public title: string;

    constructor(status: number) {
        this.status = status;
        this.title = 'Ошибка';
        this.detail = 'Неизвестная ошибка';
    }
}