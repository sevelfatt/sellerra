export class Product {
    id: string = "";
    name: string = "";
    description: string = "";
    price: number = 0;
    image_path: string = "";
    category_id: string = "";
    user_id: string = "";

    constructor(init?: Partial<Product>) {
        Object.assign(this, init);
    }
}