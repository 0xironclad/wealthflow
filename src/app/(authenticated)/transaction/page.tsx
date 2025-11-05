"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { InvoiceType } from "@/lib/types";
import {
  Loader2,
  TrendingUp,
  TrendingDown,
  PiggyBank
} from "lucide-react";
// import { CommandMenu } from "@/components/command-menu";
import TransactionsTableSearchBar from "@/components/transaction-searchbar";
import TransactionDetails from "@/components/transaction-details";
import { getExpensesById, createExpense, updateExpenseById, deleteExpenseById } from "@/server/expense";
import { useUser } from "@/context/UserContext";

// Dynamic imports
import dynamic from "next/dynamic";
const Popover = dynamic(() => import("@/components/ui/popover").then(mod => mod.Popover), { ssr: false });
const PopoverContent = dynamic(() => import("@/components/ui/popover").then(mod => mod.PopoverContent), { ssr: false });
const PopoverTrigger = dynamic(() => import("@/components/ui/popover").then(mod => mod.PopoverTrigger), { ssr: false });

const TransactionForm = dynamic(() => import('@/components/transaction-form').then(mod => mod.TransactionForm), {
  loading: () => <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className=" p-6 rounded-lg shadow-xl">
      <Loader2 className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      <p className="text-center mt-2">Loading form...</p>
    </div>
  </div>,
  ssr: false,
});



function Transaction() {
  const [editingInvoice, setEditingInvoice] = useState<InvoiceType | null>(null);
  const [isAddingInvoice, setIsAddingInvoice] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<InvoiceType | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useUser();


  const { data: expenses, isLoading } = useQuery({
    queryKey: ['expenses', user?.id],
    queryFn: () => user ? getExpensesById(user.id) : null,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60,
    enabled: !!user,
    initialData: queryClient.getQueryData(['expenses']),
    select: (data) => data
      ?.map((expense: {
        id: number;
        userid: number;
        name: string;
        date: string;
        amount: string;
        type: string;
        paymentmethod: string;
        category: string;
      }) => ({
        id: expense.id,
        userId: expense.userid,
        name: expense.name,
        date: expense.date,
        amount: parseFloat(expense.amount),
        type: expense.type,
        paymentMethod: expense.paymentmethod,
        category: expense.category
      }))
      .sort((a: InvoiceType, b: InvoiceType) => new Date(b.date).getTime() - new Date(a.date).getTime()) || []
  });


  const deleteMutation = useMutation({
    mutationFn: ({ id }: { id: number }) =>
      user ? deleteExpenseById(id, user.id) : Promise.reject("No user"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['budgetTotal'] });
      const time = new Date();
      toast({
        title: "Transaction deleted successfully",
        description: time.toLocaleString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }),
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InvoiceType> }) =>
      updateExpenseById(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['budgetTotal'] });
      setEditingInvoice(null);
      const time = new Date();
      toast({
        title: "Transaction updated successfully",
        description: time.toLocaleString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }),
      });
    },
  });

  const createMutation = useMutation({
    mutationFn: (newInvoice: Omit<InvoiceType, "id">) => createExpense(newInvoice),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['budgetTotal'] });
      setIsAddingInvoice(false);
      const time = new Date();
      toast({
        title: "Transaction added successfully",
        description: time.toLocaleString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }),
      });
    },
  });

  const handleDelete = (id: number) => {
    if (!user) return;
    deleteMutation.mutate({ id });
  };

  const handleEdit = (invoice: InvoiceType) => {
    setEditingInvoice(invoice);
  };

  const handleSave = (updatedInvoice: Partial<InvoiceType>) => {
    if (!editingInvoice?.id) return;
    updateMutation.mutate({
      id: editingInvoice.id,
      data: updatedInvoice
    });
  };

  const handleCreate = (newInvoice: Omit<InvoiceType, "id">) => {
    if (!user) return;
    createMutation.mutate({
      ...newInvoice,
      userId: user.id,
    });
  };

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="w-100vw h-screen max-w-[100vw] px-8 flex flex-col gap-2 overflow-hidden">
      <div className="flex justify-between items-center pb-5 mt-4 sticky top-0 bg-background z-20">
        <h1 className="text-3xl font-bold">History</h1>
        {/* <CommandMenu /> */}
        <TransactionsTableSearchBar />
        <Button variant="default" onClick={() => setIsAddingInvoice(true)}>
          + New Transaction
        </Button>
      </div>

      <div className="overflow-y-auto flex-1 styled-scrollbar">
        <Table>
          <TableCaption>A list of your recent transactions.</TableCaption>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Payment Method</TableHead>
              <TableHead className="text-right">Category</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500">
                  No transactions available
                </TableCell>
              </TableRow>
            ) : (
              expenses.map((invoice: InvoiceType) => (
                <Popover
                  key={invoice.id}
                  open={selectedExpense?.id === invoice.id}
                  onOpenChange={(open) =>
                    open
                      ? setSelectedExpense(invoice)
                      : setSelectedExpense(null)
                  }
                >
                  <PopoverTrigger asChild>
                    <TableRow className="cursor-pointer hover:bg-accent">
                      <TableCell className="flex items-center gap-2">
                        {(() => {
                          // const Icon = getIcon(invoice.category);
                          return (
                            <div
                              className={`p-2 rounded-full ${invoice.type === "income"
                                ? "bg-chart-1/10 text-chart-1 border border-chart-1/20"
                                : invoice.type === "saving"
                                  ? "bg-chart-2/10 text-chart-2 border border-chart-2/20"
                                  : "bg-destructive/10 text-destructive border border-destructive/20"
                                }`}
                            >
                              {invoice.type === "income" ? (
                                <TrendingUp className="w-4 h-4" />
                              ) : invoice.type === "saving" ? (
                                <PiggyBank className="w-4 h-4" />
                              ) : (
                                <TrendingDown className="w-4 h-4" />
                              )}
                            </div>
                          );
                        })()}
                        <span className="ml-2">{invoice.name}</span>
                      </TableCell>
                      <TableCell className="text-left">
                        <div className="flex flex-col">
                          <span>
                            {new Date(invoice.date).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </span>
                          <span className="text-xs text-gray-500">
                            at{" "}
                            {new Date(invoice.date).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`capitalize ${invoice.type === "income"
                            ? "border-chart-1/30 text-chart-1 bg-chart-1/5"
                            : invoice.type === "saving"
                              ? "border-chart-2/30 text-chart-2 bg-chart-2/5"
                              : "border-destructive/30 text-destructive bg-destructive/5"
                            }`}
                        >
                          {invoice.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        ${invoice.amount.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        {invoice.paymentMethod}
                      </TableCell>
                      <TableCell className="text-right">
                        {invoice.category}
                      </TableCell>
                    </TableRow>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <TransactionDetails
                      expense={invoice}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  </PopoverContent>
                </Popover>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Modal */}
      {editingInvoice && (
        <TransactionForm
          mode="edit"
          invoice={editingInvoice}
          onSubmit={handleSave}
          onCancel={() => setEditingInvoice(null)}
        />
      )}

      {/* Add New Transaction Modal */}
      {isAddingInvoice && (
        <TransactionForm
          mode="add"
          onSubmit={(formData) => {
            if (
              formData.name &&
              formData.date &&
              formData.amount &&
              formData.type &&
              formData.paymentMethod &&
              formData.category &&
              user
            ) {
              handleCreate({
                userId: user.id,
                name: formData.name,
                date: formData.date,
                amount: formData.amount,
                type: formData.type,
                paymentMethod: formData.paymentMethod,
                category: formData.category
              });
            }
          }}
          onCancel={() => setIsAddingInvoice(false)}
        />
      )}
    </div>
  );
}

export default Transaction;
