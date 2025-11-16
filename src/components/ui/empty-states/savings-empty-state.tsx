import { PiggyBank, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import SavingForm from "@/components/savings/saving-form";

interface SavingsStateProps {
    variant?: "empty" | "error";
    onRetry?: () => void;
}

export function SavingsState({ variant = "empty", onRetry }: SavingsStateProps) {
    const isError = variant === "error";

    const icon = isError ? (
        <AlertCircle className="w-12 h-12 mb-4 text-destructive" />
    ) : (
        <PiggyBank className="w-12 h-12 mb-4 text-muted-foreground" />
    );

    const title = isError ? "Failed to load savings accounts" : "No savings accounts yet";

    const description = isError
        ? "We couldn't load your savings accounts. Please try again or check your connection."
        : "You don't have any savings accounts set up yet. Start saving today by creating your first savings goal.";

    return (
        <Card className="flex flex-col items-center justify-center w-full h-full p-6 text-center rounded-lg bg-muted/20">
            {icon}
            <h3 className="text-lg font-medium mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
                {description}
            </p>
            <div className="flex gap-2">
                {isError && onRetry && (
                    <Button variant="outline" onClick={onRetry}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Retry
                    </Button>
                )}
                {!isError && (
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="default">+ New Saving</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogPrimitive.Title asChild>
                                <DialogTitle>
                                    New Saving
                                </DialogTitle>
                            </DialogPrimitive.Title>
                            <DialogHeader>
                                <DialogTitle>Add a New Saving</DialogTitle>
                            </DialogHeader>
                            <SavingForm />
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </Card>
    );
}
