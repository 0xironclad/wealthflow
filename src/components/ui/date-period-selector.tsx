"use client"

import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDatePeriod, type DatePeriodType } from "@/hooks/useDatePeriod"

interface DatePeriodSelectorProps {
    onPeriodChange?: (from: string, to: string, periodType: DatePeriodType) => void
}

export function DatePeriodSelector({ onPeriodChange }: DatePeriodSelectorProps) {
    const {
        selectedPeriod,
        currentPeriod,
        periodOptions,
        setPeriod
    } = useDatePeriod()

    const handlePeriodSelect = (period: DatePeriodType) => {
        setPeriod(period)

        // Calculate the new period dates
        const now = new Date()
        const today = now.toISOString().split('T')[0]
        let from = today

        switch (period) {
            case "6months":
                from = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate()).toISOString().split('T')[0]
                break
            case "12months":
                from = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()).toISOString().split('T')[0]
                break
        }

        onPeriodChange?.(from, today, period)
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="min-w-[180px] justify-between">
                    <span>{currentPeriod.label}</span>
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
                {periodOptions.map((option) => (
                    <DropdownMenuItem
                        key={option.value}
                        onClick={() => handlePeriodSelect(option.value)}
                        className={selectedPeriod === option.value ? "bg-accent" : ""}
                    >
                        {option.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
