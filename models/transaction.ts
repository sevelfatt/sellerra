export class transaction {
    id: number = 0;
    customer_id: number = 0;
    user_id: string = "";
    total_price: number = 0;
    created_at?: string;

    constructor(init?: Partial<transaction>) {
        Object.assign(this, init);
    }
}

export class transactionItem {
    id: number = 0;
    transaction_id: number = 0;
    amount: number = 0;
    total_price: number = 0;
    product_id: number = 0;
    user_id: string = "";

    constructor(init?: Partial<transactionItem>) {
        Object.assign(this, init);
    }
}
