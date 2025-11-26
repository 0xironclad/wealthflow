import { InvoiceType, ExpenseType, PaymentMethod, ExpenseCategory } from "@/lib/types";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface TransactionFormProps {
    mode: 'add' | 'edit';
    invoice?: InvoiceType;
    onSubmit: (invoice: Partial<InvoiceType>) => void;
    onCancel: () => void;
}

export function TransactionForm({
    mode,
    invoice,
    onSubmit,
    onCancel,
}: TransactionFormProps) {
    const title = mode === 'add' ? 'Add New Transaction' : 'Edit Transaction';
    const description = mode === 'add'
        ? 'Enter the details for your new transaction.'
        : 'Update the transaction details below.';
    const submitLabel = mode === 'add' ? 'Add Transaction' : 'Save Changes';

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <Card className="w-[400px]">
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                            e.preventDefault();
                            const form = e.currentTarget;
                            const formData = {
                                name: (form.elements.namedItem("name") as HTMLInputElement).value,
                                date: new Date(
                                    (form.elements.namedItem("date") as HTMLInputElement).value
                                ).toISOString(),
                                amount: parseFloat(
                                    (form.elements.namedItem("amount") as HTMLInputElement).value
                                ),
                                type: (form.elements.namedItem("type") as HTMLSelectElement)
                                    .value as ExpenseType,
                                paymentMethod: (
                                    form.elements.namedItem("paymentMethod") as HTMLSelectElement
                                ).value as PaymentMethod,
                                category: (
                                    form.elements.namedItem("category") as HTMLSelectElement
                                ).value as ExpenseCategory,
                            };

                            onSubmit(mode === 'edit' && invoice
                                ? { ...formData, id: invoice.id }
                                : formData
                            );
                        }}
                        className="space-y-4"
                    >
                        <div className="flex flex-col space-y-1.5">
                            <Input
                                name="name"
                                placeholder="Transaction Name"
                                required
                                defaultValue={invoice?.name}
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Input
                                name="date"
                                type="date"
                                required
                                defaultValue={
                                    invoice?.date
                                        ? new Date(invoice.date)
                                            .toISOString()
                                            .split("T")[0]
                                        : undefined
                                }
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Input
                                name="amount"
                                type="number"
                                placeholder="Amount"
                                step="0.01"
                                min="0"
                                required
                                defaultValue={invoice?.amount}
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Select
                                name="type"
                                required
                                defaultValue={invoice?.type}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Transaction Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="income">Income</SelectItem>
                                    <SelectItem value="expense">Expense</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Select
                                name="paymentMethod"
                                required
                                defaultValue={invoice?.paymentMethod}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Payment Method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cash">Cash</SelectItem>
                                    <SelectItem value="credit">Credit</SelectItem>
                                    <SelectItem value="debit">Debit</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Select
                                name="category"
                                required
                                defaultValue={invoice?.category}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Food">Food</SelectItem>
                                    <SelectItem value="Rent">Rent</SelectItem>
                                    <SelectItem value="Transport">Transport</SelectItem>
                                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                                    <SelectItem value="Health">Health</SelectItem>
                                    <SelectItem value="Utilities">Utilities</SelectItem>
                                    <SelectItem value="Education">Education</SelectItem>
                                    <SelectItem value="Shopping">Shopping</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCancel}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-primary hover:bg-primary/90">{submitLabel}</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
