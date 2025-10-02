import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "../ui/card"
import { Budget } from "@/lib/types"

function BudgetDetails() {

    // Mock data with varied, realistic budget information
    const mockData: Budget[] = [
        {
            id: 1,
            userId: "1",
            name: "Groceries Budget",
            description: "Monthly grocery shopping",
            periodType: "monthly",
            startDate: "2024-01-01",
            endDate: "2024-01-31",
            category: "Groceries",
            plannedAmount: 450,
            spentAmount: 320,
            rollOver: false,
        },
        {
            id: 2,
            userId: "1",
            name: "Transportation",
            description: "Gas, public transport, rideshare",
            periodType: "monthly",
            startDate: "2024-01-01",
            endDate: "2024-01-31",
            category: "Transportation",
            plannedAmount: 320,
            spentAmount: 280,
            rollOver: false,
        },
        {
            id: 3,
            userId: "1",
            name: "Entertainment",
            description: "Movies, games, subscriptions",
            periodType: "monthly",
            startDate: "2024-01-01",
            endDate: "2024-01-31",
            category: "Entertainment",
            plannedAmount: 200,
            spentAmount: 150,
            rollOver: false,
        },
        {
            id: 4,
            userId: "1",
            name: "Utilities",
            description: "Electricity, water, internet",
            periodType: "monthly",
            startDate: "2024-01-01",
            endDate: "2024-01-31",
            category: "Utilities",
            plannedAmount: 180,
            spentAmount: 175,
            rollOver: false,
        },
        {
            id: 5,
            userId: "1",
            name: "Dining Out",
            description: "Restaurants and takeout",
            periodType: "monthly",
            startDate: "2024-01-01",
            endDate: "2024-01-31",
            category: "Dining",
            plannedAmount: 150,
            spentAmount: 220,
            rollOver: false,
        },
        {
            id: 6,
            userId: "1",
            name: "Healthcare",
            description: "Medical expenses and prescriptions",
            periodType: "monthly",
            startDate: "2024-01-01",
            endDate: "2024-01-31",
            category: "Healthcare",
            plannedAmount: 100,
            spentAmount: 85,
            rollOver: false,
        },
        {
            id: 7,
            userId: "1",
            name: "Shopping",
            description: "Clothing and personal items",
            periodType: "monthly",
            startDate: "2024-01-01",
            endDate: "2024-01-31",
            category: "Shopping",
            plannedAmount: 200,
            spentAmount: 95,
            rollOver: false,
        }
    ]
    return (
        <Card className="w-full h-[400px]">
            <CardContent>
                <Table>
                    <TableCaption>A list of your current budgets.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="font-semibold text-base">Budget Name</TableHead>
                            <TableHead className="font-semibold text-base">Category</TableHead>
                            <TableHead className="font-semibold text-base">Period</TableHead>
                            <TableHead className="font-semibold text-base text-right">Planned</TableHead>
                            <TableHead className="font-semibold text-base text-right">Spent</TableHead>
                            <TableHead className="font-semibold text-base text-right">Remaining</TableHead>
                            <TableHead className="font-semibold text-base text-right">Progress</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="overflow-y-auto styled-scrollbar">
                        {mockData.map((data) => {
                            const remaining = data.plannedAmount - data.spentAmount
                            const progress = Math.round((data.spentAmount / data.plannedAmount) * 100)
                            const isOverBudget = data.spentAmount > data.plannedAmount

                            return (
                                <TableRow key={data.id}>
                                    <TableCell className="font-medium">{data.name}</TableCell>
                                    <TableCell>{data.category}</TableCell>
                                    <TableCell>{data.periodType}</TableCell>
                                    <TableCell className="text-right">${data.plannedAmount}</TableCell>
                                    <TableCell className={`text-right ${isOverBudget ? 'text-red-600 font-medium' : ''}`}>
                                        ${data.spentAmount}
                                    </TableCell>
                                    <TableCell className={`text-right ${remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                        ${remaining}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <span className={`${isOverBudget ? 'text-red-600' : progress > 80 ? 'text-yellow-600' : 'text-green-600'}`}>
                                            {progress}%
                                        </span>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

export default BudgetDetails