/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { Budget } from "@/lib/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar"
import { Calendar as CalendarIcon } from "lucide-react";
import { updateBudgetById, createBudget } from "@/server/budget";
import {
    DialogClose,
    DialogFooter,
} from "@/components/ui/dialog";


export function Calendar02({
    startDate,
    endDate
}: {
    startDate?: Date,
    endDate?: Date
}) {
    return (
        <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
                Selected Date Range
            </div>
            <Calendar
                mode="range"
                numberOfMonths={2}
                selected={{
                    from: startDate,
                    to: endDate
                }}
                className="rounded-lg border shadow-sm"
                disabled={true}
            />
            <div className="flex justify-between text-sm">
                <div>
                    <span className="font-medium">Start:</span> {startDate ? format(startDate, "PPP") : "Not set"}
                </div>
                <div>
                    <span className="font-medium">End:</span> {endDate ? format(endDate, "PPP") : "Not set"}
                </div>
            </div>
        </div>
    )
}


const formSchema = z.object({
    name: z.string().min(1).max(50),
    description: z.string().optional(),
    periodType: z.string(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    category: z.string(),
    plannedAmount: z.coerce.number().min(0),
    spentAmount: z.coerce.number().min(0),
    rollOver: z.string()
});

type ResultType = {
    success: boolean,
    message?: string,
    data?: any
};

export function EditBudgetForm({
    budget,
    onSuccessfulSubmit
}: {
    budget: Budget,
    onSuccessfulSubmit?: (budgetData: any) => void
}) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: budget.name,
            description: budget.description || "",
            periodType: budget.periodType,
            startDate: new Date(budget.startDate),
            endDate: new Date(budget.endDate),
            category: budget.category,
            plannedAmount: budget.plannedAmount,
            spentAmount: budget.spentAmount,
            rollOver: budget.rollOver ? "yes" : "no"
        },
    });

    // Watch for period type changes
    const periodType = form.watch("periodType");
    const startDate = form.watch("startDate");
    const endDate = form.watch("endDate");

    useEffect(() => {
        if (periodType) {
            const today = new Date();
            let newStartDate: Date;
            let newEndDate: Date;

            switch (periodType) {
                case "daily":
                    newStartDate = today;
                    newEndDate = today;
                    break;
                case "weekly":
                    newStartDate = startOfWeek(today, { weekStartsOn: 1 }); // Monday start
                    newEndDate = endOfWeek(today, { weekStartsOn: 1 });
                    break;
                case "monthly":
                    newStartDate = startOfMonth(today);
                    newEndDate = endOfMonth(today);
                    break;
                default:
                    return;
            }

            form.setValue("startDate", newStartDate);
            form.setValue("endDate", newEndDate);
        }
    }, [periodType, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const formData = {
                id: budget.id,
                userId: budget.userId,
                name: values.name,
                description: values.description || "",
                periodType: values.periodType,
                startDate: values.startDate.toISOString(),
                endDate: values.endDate.toISOString(),
                category: values.category,
                plannedAmount: values.plannedAmount,
                spentAmount: values.spentAmount,
                rollOver: values.rollOver === "yes",
            };

            let result: ResultType;
            if (budget.id === 0) {
                result = await createBudget(formData);
            } else {
                result = await updateBudgetById(budget.id, budget.userId, formData);
            }

            if (result.success) {
                if (onSuccessfulSubmit) {
                    onSuccessfulSubmit(formData);
                }
            }
        } catch (error) {
            console.error("Form submission error:", error);
        }
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Budget name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Money for food"
                                        type="text"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Add notes or details about this budget..."
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="periodType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Period type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select your period type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="daily">Daily</SelectItem>
                                        <SelectItem value="weekly">Weekly</SelectItem>
                                        <SelectItem value="monthly">Monthly</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="space-y-4">
                        <FormLabel>Date Range:</FormLabel>
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-6">
                                <FormField
                                    control={form.control}
                                    name="startDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Start date</FormLabel>
                                            <div className="text-sm font-medium">
                                                {field.value ? format(field.value, "PPP") : "No date selected"}
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="col-span-6">
                                <FormField
                                    control={form.control}
                                    name="endDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>End date</FormLabel>
                                            <div className="text-sm font-medium">
                                                {field.value ? format(field.value, "PPP") : "No date selected"}
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    Selected Date Range
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-4" align="start">
                                <Calendar02
                                    startDate={startDate}
                                    endDate={endDate}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="e.g., Gas" />
                                        </SelectTrigger>
                                    </FormControl>
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
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="spentAmount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Spent Amount</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="0.00"
                                        {...field}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            field.onChange(value === "" ? 0 : Number(value));
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="plannedAmount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Planned Amount</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="0.00"
                                        {...field}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            field.onChange(value === "" ? 0 : Number(value));
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="rollOver"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Roll over?</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Roll over to the next period" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="yes">Yes</SelectItem>
                                        <SelectItem value="no">No</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Cancel
                            </Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button type="submit" disabled={form.formState.isSubmitting || !form.formState.isValid}>
                                {form.formState.isSubmitting ? "Saving..." : "Save"}
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </Form>
        </>
    );
}
