import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { SavingsType } from "@/lib/types"
import { useUser } from "@/context/UserContext"
import { SavingsNoData } from "./empty states/no-data-savings"
import { useSavings } from "@/lib/queries"
import LoadingComponent from "./loading-component"

function Savings() {
    const { user, isLoading: isAuthLoading } = useUser();

    const { data: savings, isLoading } = useSavings(user?.id ?? '');

    if (!user?.id) return null;

    if (isLoading || isAuthLoading) {
        return <LoadingComponent title="Savings" />
    }

    // Check if there are no savings
    const hasNoSavings = !savings || savings.length === 0;

    return hasNoSavings ? (
        <SavingsNoData />
    ) : (
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
    );

}

export default Savings
