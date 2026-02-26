export class transaction{
    id: number = 0;
    customer_id: number= 0 ;
    user_id: string = "";
}

export class transactionItem{
    id: number = 0;
    transaction_id: number = 0;
    product_id: number = 0;
    user_id: string = "";
}