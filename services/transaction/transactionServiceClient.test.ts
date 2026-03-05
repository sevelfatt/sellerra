import { createTransaction, getTransactionById } from "./transactionServiceClient";
import { transaction, transactionItem } from "@/models/transaction";
import { createClient } from "@/lib/supabase/client";

jest.mock("@/lib/supabase/client");

describe("transactionServiceClient", () => {
    const mockUpdate = jest.fn();
    const mockSingle = jest.fn();
    const mockEq = jest.fn();
    const mockSelect = jest.fn();
    const mockInsert = jest.fn();
    const mockFrom = jest.fn();


    const queryBuilder = {
        insert: mockInsert,
        select: mockSelect,
        update: mockUpdate,
        eq: mockEq,
        single: mockSingle,
    };


    beforeEach(() => {
        mockFrom.mockReturnValue(queryBuilder);
        mockInsert.mockReturnValue(queryBuilder);
        mockSelect.mockReturnValue(queryBuilder);
        mockUpdate.mockReturnValue(queryBuilder);
        mockEq.mockReturnValue(queryBuilder);


        (createClient as jest.Mock).mockReturnValue({
            from: mockFrom,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("createTransaction", () => {
        it("creates a transaction and its items successfully", async () => {
            const userId = "user-123";
            const newTransaction = new transaction({
                customer_id: 1,
                user_id: userId,
                total_price: 1000,
            });

            const items = [
                new transactionItem({
                    product_id: 1,
                    amount: 2,
                    total_price: 1000,
                    user_id: userId,
                }),
            ];

            const mockTransactionData = { ...newTransaction, id: 1 };
            const mockItemsData = [{ ...items[0], id: 1, transaction_id: 1 }];

            // Chain 1: transactions.insert().select().single()
            mockSelect.mockReturnValueOnce(queryBuilder);
            mockSingle.mockResolvedValueOnce({ data: mockTransactionData, error: null });
            
            // Chain 2: transaction_items.insert().select()
            mockSelect.mockResolvedValueOnce({ data: mockItemsData, error: null });

            // Chain 3: Loop items - products.select().eq().single()
            mockSelect.mockReturnValueOnce(queryBuilder);
            mockEq.mockReturnValueOnce(queryBuilder);
            mockSingle.mockResolvedValueOnce({ data: { stocks: 10 }, error: null });

            // Chain 4: Loop items - products.update().eq()
            mockUpdate.mockReturnValueOnce(queryBuilder);
            mockEq.mockResolvedValueOnce({ error: null });


            const result = await createTransaction(userId, newTransaction, items);

            expect(result).toEqual(mockTransactionData);
            expect(mockFrom).toHaveBeenCalledWith("transactions");
            expect(mockFrom).toHaveBeenCalledWith("transaction_items");
        });

        it("throws error if transaction insertion fails", async () => {
            const userId = "user-123";
            const newTransaction = new transaction({ customer_id: 1 });
            const items: transactionItem[] = [];

            // Chain 1: transactions.insert().select().single()
            mockSelect.mockReturnValueOnce(queryBuilder);
            mockSingle.mockResolvedValueOnce({ data: null, error: { message: "Transaction failed" } });

            await expect(createTransaction(userId, newTransaction, items)).rejects.toThrow("Transaction failed");
        });
    });

    describe("getTransactionById", () => {
        it("returns transaction with its items", async () => {
            const transactionId = 1;
            const mockTransaction = { id: 1, customer_id: 1, total_price: 1000 };
            const mockItems = [{ id: 1, transaction_id: 1, product_id: 1, amount: 2 }];

            // Chain 1: transactions.select().eq().single()
            mockSelect.mockReturnValueOnce(queryBuilder);
            mockEq.mockReturnValueOnce(queryBuilder); 
            mockSingle.mockResolvedValueOnce({ data: mockTransaction, error: null });
            
            // Chain 2: transaction_items.select().eq()
            mockSelect.mockReturnValueOnce(queryBuilder);
            mockEq.mockResolvedValueOnce({ data: mockItems, error: null });

            const result = await getTransactionById(transactionId);

            expect(result.transaction).toEqual(mockTransaction);
            expect(result.items).toEqual(mockItems);
        });
    });
});
