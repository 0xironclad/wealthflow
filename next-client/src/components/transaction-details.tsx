import { InvoiceType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TbEdit } from "react-icons/tb";
import { MdDeleteOutline } from "react-icons/md";

interface TransactionDetailsProps {
  expense: InvoiceType;
  onEdit: (expense: InvoiceType) => void;
  onDelete: (id: number) => void;
}

function TransactionDetails({ expense, onEdit, onDelete }: TransactionDetailsProps) {
  return (
    <div className="flex flex-col gap-4 p-5">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">{expense.name}</h3>
        <Badge
          variant="outline"
          className={`capitalize ${expense.type === "income"
            ? "border-chart-1/30 text-chart-1 bg-chart-1/5"
            : expense.type === "saving"
              ? "border-chart-2/30 text-chart-2 bg-chart-2/5"
              : "border-destructive/30 text-destructive bg-destructive/5"
            }`}
        >
          {expense.type}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-muted-foreground">Amount</p>
          <p className="font-medium">${expense.amount.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Category</p>
          <p className="font-medium">{expense.category}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Payment Method</p>
          <p className="font-medium capitalize">{expense.paymentMethod}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Date</p>
          <p className="font-medium">
            {format(new Date(expense.date), "MMM dd, yyyy")}
          </p>
        </div>
      </div>

      <div className="flex gap-2 pt-3 border-t">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => onEdit(expense)}
        >
          <TbEdit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-destructive hover:text-destructive"
          onClick={() => onDelete(expense.id)}
        >
          <MdDeleteOutline className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>
    </div>
  );
}

export default TransactionDetails;
