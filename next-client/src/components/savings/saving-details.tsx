"use client"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Coins, Calendar, Edit, Plus, Minus, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { determineStatus as determineSavingStatus } from "@/lib/determine-status";
import AddMoneyModal from "./add-money";
import WithdrawMoneyModal from "./withdraw-money";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useQuery } from "@tanstack/react-query";
import { getSavings } from "@/server/saving";
import { Saving } from "@/lib/types";
import { useUser } from "@/context/UserContext";
import { useEffect } from "react";

interface SavingDetailsProps {
  savingId: number;
  onClose?: () => void;
  onAddMoney?: (savingId: number) => void;
  onWithdraw?: (savingId: number) => void;
  onEdit?: (savingId: number) => void;
}

export function SavingDetails({
  savingId,
  onClose,
  onAddMoney,
  onWithdraw,
  onEdit,
}: SavingDetailsProps) {

  const { user, isLoading: isAuthLoading } = useUser();

  const { data: savings, isLoading } = useQuery({
    queryKey: ['savings', user?.id],
    enabled: !!user?.id,
    queryFn: () => getSavings(user?.id ?? ''),
    select: (data) => data.map((saving: {
      id: number;
      userid: number;
      name: string;
      createdat: string;
      amount: string;
      goal: string;
      status: string;
      description: string;
      targetDate?: string;
    }) => ({
      id: saving.id,
      userId: saving.userid,
      name: saving.name,
      createdAt: saving.createdat,
      amount: parseFloat(saving.amount),
      goal: parseFloat(saving.goal),
      status: saving.status,
      description: saving.description,
      targetDate: saving.targetDate
    }))
  });

  const currentSaving = savings?.find((s: Saving) => s.id === savingId);



  const progressPercentage = currentSaving ? Math.min(Math.round((currentSaving.amount / currentSaving.goal) * 100), 100) : 0;

  useEffect(() => {
    if (currentSaving) {
      const newStatus = determineSavingStatus(
        currentSaving.amount,
        currentSaving.goal,
        currentSaving.targetDate,
        currentSaving.createdAt
      );

      if (newStatus !== currentSaving.status) {
        fetch(`/api/savings/${currentSaving.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });
      }
    }
  }, [currentSaving]);

  if (isLoading || isAuthLoading) {
    return <div>Loading...</div>;
  }

  if (!currentSaving) {
    return <div>Saving not found</div>;
  }

  const formatSafeDate = (dateString: string | undefined) => {
    if (!dateString) return "Not specified";

    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        return "Invalid date";
      }

      return format(date, "MMM dd, yyyy");
    } catch (error) {
      console.error("Date parsing error:", error);
      return "Invalid date";
    }
  };

  const createdDate = formatSafeDate(currentSaving.createdAt);
  const targetDate = formatSafeDate(currentSaving.targetDate);

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader className="flex flex-row items-center justify-between bg-muted/30 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Coins className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>{currentSaving.name}</CardTitle>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant={
              currentSaving.status === "completed"
                ? "default"
                : currentSaving.status === "active"
                  ? "secondary"
                  : "destructive"
            }
          >
            {currentSaving.status.charAt(0).toUpperCase() +
              currentSaving.status.slice(1)}
          </Badge>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <p className="font-medium">Goal Progress</p>
            <p className="font-bold">{progressPercentage.toFixed(2)}%</p>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-sm text-muted-foreground">
            ${currentSaving.amount.toLocaleString()} saved of $
            {currentSaving.goal.toLocaleString()} goal
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Description</h3>
          <div className="rounded-md bg-muted/30 p-3 text-sm">
            {currentSaving.description || "No description provided."}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Details</h3>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Created: </span>
              <span>{createdDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Target Date: </span>
              <span>{targetDate}</span>
            </div>
          </div>
        </div>

        {currentSaving.status !== "completed" && (
          <div className="rounded-md border border-primary/20 bg-primary/5 p-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">Target Completion</span>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {new Date(currentSaving.createdAt).toLocaleDateString()}
                </span>
                <Badge
                  variant={
                    new Date(currentSaving.targetDate) > new Date()
                      ? "outline"
                      : "destructive"
                  }
                  className="text-xs"
                >
                  {new Date(currentSaving.targetDate) > new Date()
                    ? `${Math.ceil(
                      (new Date(currentSaving.targetDate).getTime() -
                        new Date().getTime()) /
                      (1000 * 60 * 60 * 24)
                    )} days left`
                    : "Overdue"}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-3 pt-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="flex-1"
              onClick={() => onAddMoney?.(currentSaving.id)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Money
            </Button>
          </DialogTrigger>
          <DialogContent className="p-0 gap-0">
            <DialogPrimitive.Title asChild>
              <VisuallyHidden>Add Money to Saving</VisuallyHidden>
            </DialogPrimitive.Title>
            <DialogDescription asChild>
              <VisuallyHidden>Add money to your saving goal</VisuallyHidden>
            </DialogDescription>
            <AddMoneyModal savingId={currentSaving.id} />
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onWithdraw?.(currentSaving.id)}
            >
              <Minus className="mr-2 h-4 w-4" />
              Withdraw
            </Button>
          </DialogTrigger>
          <DialogContent className="p-0 gap-0">
            <DialogPrimitive.Title asChild>
              <VisuallyHidden>Withdraw Money from Saving</VisuallyHidden>
            </DialogPrimitive.Title>
            <DialogDescription asChild>
              <VisuallyHidden>Withdraw money from your saving goal</VisuallyHidden>
            </DialogDescription>
            <WithdrawMoneyModal savingId={currentSaving.id} />
          </DialogContent>
        </Dialog>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => onEdit?.(currentSaving.id)}
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit Goal
        </Button>
      </CardFooter>
    </Card>
  );
}
