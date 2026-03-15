export class expense {
    id: number = 0;
    name: string = "";
    amount: number = 0;
    user_id: string = "";
    created_at: string = new Date().toISOString();

    constructor(init?: Partial<expense>) {
        Object.assign(this, init);
    }
}