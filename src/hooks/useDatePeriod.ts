"use client"

import { useState, useMemo } from "react"

export type DatePeriodType = "6months" | "12months"

export interface DatePeriod {
    type: DatePeriodType
    label: string
    from: string
    to: string
}

export function useDatePeriod(defaultPeriod: DatePeriodType = "6months") {
    const [selectedPeriod, setSelectedPeriod] = useState<DatePeriodType>(defaultPeriod)

    // Calculate date ranges based on period type
    const currentPeriod = useMemo((): DatePeriod => {
        const now = new Date()
        const today = now.toISOString().split('T')[0]

        switch (selectedPeriod) {
            case "6months": {
                const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate())
                return {
                    type: "6months",
                    label: "Last 6 Months",
                    from: sixMonthsAgo.toISOString().split('T')[0],
                    to: today
                }
            }

            case "12months": {
                const twelveMonthsAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
                return {
                    type: "12months",
                    label: "Last 12 Months",
                    from: twelveMonthsAgo.toISOString().split('T')[0],
                    to: today
                }
            }



            default:
                return {
                    type: "6months",
                    label: "Last 6 Months",
                    from: new Date(now.getFullYear(), now.getMonth() - 6, now.getDate()).toISOString().split('T')[0],
                    to: today
                }
        }
    }, [selectedPeriod])

    // Available period options
    const periodOptions: Array<{ value: DatePeriodType; label: string }> = [
        { value: "6months", label: "Last 6 Months" },
        { value: "12months", label: "Last 12 Months" }
    ]

    // Helper functions
    const setPeriod = (period: DatePeriodType) => {
        setSelectedPeriod(period)
    }



    // Get formatted date range for display
    const getFormattedDateRange = () => {
        const fromDate = new Date(currentPeriod.from)
        const toDate = new Date(currentPeriod.to)

        const formatOptions: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }

        return `${fromDate.toLocaleDateString('en-US', formatOptions)} - ${toDate.toLocaleDateString('en-US', formatOptions)}`
    }

    return {
        // Current state
        selectedPeriod,
        currentPeriod,

        // Available options
        periodOptions,

        // Actions
        setPeriod,

        // Helpers
        getFormattedDateRange
    }
}
