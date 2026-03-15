import { requireUser } from "@/services/auth/authServiceServer";
import { getExpenses } from "@/services/expense/expenseServiceServer";
import ExpenseForm from "@/components/reports/ExpenseForm";
import ExpenseList from "@/components/reports/ExpenseList";
import { Suspense } from "react";

export default async function ExpensesPage() {
    const user = await requireUser();
    const expenses = await getExpenses(user.id);

    return (
        <div className="flex-1 w-full flex flex-col gap-8 max-w-6xl mx-auto p-5">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Expense Management</h1>
                <p className="text-muted-foreground">Manage your business expenses to track your clean income.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <ExpenseForm userId={user.id} />
                </div>
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-bold px-1">Recent Expenses</h2>
                    <Suspense fallback={<div className="h-64 w-full bg-muted animate-pulse rounded-xl" />}>
                        <ExpenseList expenses={expenses} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
