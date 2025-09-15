"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
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
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Saving } from "@/lib/types";
import { useCreateSaving } from "@/server/saving";
import { useUser } from "@/context/UserContext";

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name must be less than 255 characters"),
  description: z.string().nullable(),
  goal: z.coerce.number().min(0, "Goal must be greater than 0").nullable(),
  amount: z.coerce.number().min(0, "Amount must be greater than 0"),
  targetDate: z.coerce.date().nullable(),
  status: z.enum(["active", "completed", "atRisk"]).default("active"),
});


interface SavingFormProps {
  saving?: Saving;
  onSuccessfulSubmit?: (savingData: Saving) => void;
}

export default function SavingForm({ saving, onSuccessfulSubmit }: SavingFormProps) {
  const { user } = useUser();


  const createSavingMutation = useCreateSaving();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: saving?.name || "",
      description: saving?.description || "",
      goal: saving?.goal || 0,
      amount: saving?.amount || 0,
      targetDate: saving?.targetDate
        ? new Date(saving.targetDate)
        : new Date(new Date().setMonth(new Date().getMonth() + 6)),
      status: saving?.status || "active",
    },
  });
  if (!user) {
    return null;
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }

      const formData = {
        userId: user.id,
        name: values.name,
        description: values.description || "",
        goal: values.goal || 0,
        amount: values.amount || 0,
        createdAt: saving?.createdAt || new Date().toISOString(),
        targetDate: values.targetDate?.toISOString() || new Date().toISOString(),
        status: values.status || "active",
      };

      const result = await createSavingMutation.mutateAsync(formData);

      if (result.success) {
        toast.success("Saving created successfully!");
        if (onSuccessfulSubmit) {
          onSuccessfulSubmit(result.data);
        }
      } else {
        throw new Error(result.message || "Failed to create saving");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save. Please try again.");
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Saving name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Emergency Fund" {...field} />
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
                  <Input placeholder="What are you saving for?" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="goal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Goal Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="1000"
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const value = e.target.value === "" ? 0 : Number(e.target.value);
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value === "" ? 0 : Number(e.target.value);
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="targetDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Target date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value || undefined}
                      onSelect={field.onChange}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" className="w-full">
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting || !form.formState.isValid}
              >
                {form.formState.isSubmitting ? "Saving..." : "Save"}
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
}
