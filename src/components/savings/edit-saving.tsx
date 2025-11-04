"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Calendar as CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { DialogClose, DialogFooter } from "@/components/ui/dialog"
import { Saving } from "@/lib/types"
import { useUpdateSaving } from "@/server/saving"
import { toast } from "sonner"

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name must be less than 255 characters"),
  description: z.string().nullable(),
  goal: z.coerce.number().min(0, "Goal must be greater than 0").nullable(),
  amount: z.coerce.number().min(0, "Amount must be greater than 0"),
  targetDate: z.coerce.date().nullable(),
  status: z.enum(["active", "completed", "atRisk"]).default("active"),
})

export default function EditSaving({ saving }: { saving: Saving }) {
  const updateSaving = useUpdateSaving()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: saving.name,
      description: saving.description || "",
      goal: saving.goal,
      amount: saving.amount,
      targetDate: saving.targetDate ? new Date(saving.targetDate) : null,
      status: saving.status,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const payload = {
        id: saving.id,
        name: values.name,
        description: values.description ?? null,
        goal: values.goal ?? null,
        amount: values.amount,
        targetDate: values.targetDate ? values.targetDate.toISOString() : null,
        status: values.status,
      }
      await updateSaving.mutateAsync(payload)
      toast.success("Goal updated")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update goal")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
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
                    const value = e.target.value === "" ? 0 : Number(e.target.value)
                    field.onChange(value)
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
                    const value = e.target.value === "" ? 0 : Number(e.target.value)
                    field.onChange(value)
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
              {form.formState.isSubmitting ? "Saving..." : "Save changes"}
            </Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </Form>
  )
}


