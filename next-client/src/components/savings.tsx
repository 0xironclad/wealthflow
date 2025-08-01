import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { SavingsType } from "@/lib/types"
import { Loader2 } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { getSavings } from "@/server/saving"
import { useUser } from "@/context/UserContext"

function Savings() {
    const { user, isLoading: isAuthLoading } = useUser();

    const { data: savings, isLoading } = useQuery({
        queryKey: ['savings', user?.id],
        queryFn: () => user ? getSavings(user.id) : null,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 60,
        enabled: !!user,
        select: (data) => data.map((saving: {
            id: number;
            userid: number;
            name: string;
            date: string;
            amount: string;
            goal: string;
            status: string;
        }) => ({
            id: saving.id,
            userId: saving.userid,
            name: saving.name,
            date: saving.date,
            amount: parseFloat(saving.amount),
            goal: parseFloat(saving.goal),
            status: saving.status
        }))
    });

    if (isLoading || isAuthLoading) {
        return (
            <Card className="h-full flex flex-col">
                <div className="flex justify-between p-4 items-center flex-none">
                    <CardTitle>Savings</CardTitle>
                </div>
                <CardContent className="flex items-center justify-center h-[200px]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-full flex flex-col">
            <div className="flex justify-between p-4 items-center flex-none">
                <CardTitle>Savings</CardTitle>
                <CardDescription>
                    <Link href="/goals" className="text-foreground/70" prefetch={true}>
                        View all
                    </Link>
                </CardDescription>
            </div>
            <CardContent className="overflow-y-scroll max-h-[200px] styled-scrollbar">
                <div className="space-y-4">
                    {savings?.map((saving: SavingsType) => (
                        <div key={saving.name} className="space-y-1.5">
                            <p className="text-sm text-muted-foreground">{saving.name}</p>
                            <Progress value={saving.goal ? (saving.amount / saving.goal * 100) : 0} />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default Savings
