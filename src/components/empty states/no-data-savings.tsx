import { Card, CardTitle, CardContent } from "../ui/card";
import Link from "next/link";
import { PiggyBank, Plus, Target } from "lucide-react";
import { Button } from "../ui/button";

export function SavingsNoData() {
    return (
        <Card className="h-full flex flex-col">
            <div className="flex justify-between p-4 items-center flex-none">
                <CardTitle>Savings</CardTitle>
            </div>
            <CardContent className="flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center justify-center space-y-6 px-4 text-center">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <PiggyBank className="w-10 h-10 text-primary" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-chart-2/20 flex items-center justify-center">
                            <Target className="w-3 h-3 text-chart-2" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-foreground">
                            No savings goals yet
                        </h3>
                    </div>

                    <Link href="/goals" className="w-full">
                        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                            <Plus className="w-4 h-4 mr-2" />
                            Create Your First Goal
                        </Button>
                    </Link>

                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <div className="flex -space-x-1">
                            <div className="w-5 h-5 rounded-full bg-chart-1/20 flex items-center justify-center">
                                <PiggyBank className="w-2.5 h-2.5 text-chart-1" />
                            </div>
                            <div className="w-5 h-5 rounded-full bg-chart-2/20 flex items-center justify-center">
                                <Target className="w-2.5 h-2.5 text-chart-2" />
                            </div>
                        </div>
                        <span>Emergency fund, vacation & more</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}