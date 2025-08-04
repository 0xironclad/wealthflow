import { PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import SavingForm from "@/components/savings/saving-form";

export function SavingsEmptyState() {
    return (
        <Card className="flex flex-col items-center justify-center w-full h-full p-6 text-center rounded-lg bg-muted/20">
            <PiggyBank className="w-12 h-12 mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No savings accounts yet</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
                You don't have any savings accounts set up yet. Start saving today by creating your first savings goal.
            </p>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="default">+ New Saving</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogPrimitive.Title asChild>
                        <VisuallyHidden>
                            New Saving
                        </VisuallyHidden>
                    </DialogPrimitive.Title>
                    <DialogHeader>
                        <DialogTitle>Add a New Saving</DialogTitle>
                    </DialogHeader>
                    <SavingForm />
                </DialogContent>
            </Dialog>
        </Card>
    );
}
