export class customer {
    id: number = 0;
    user_id: string = "";
    name: string = "";
    whatsapp_number: string = "";

    constructor(init?: Partial<customer>) {
        Object.assign(this, init);
    }
}
