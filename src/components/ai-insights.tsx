"use client";
import { useState, useCallback, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { ErrorState } from "./ui/empty-states/error-state";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";

interface Insight {
  title: string;
  description: string;
  goalName?: string;
  progress?: string;
  suggestionType?: 'motivation' | 'action' | 'adjustment' | 'celebration';
}



interface CachedInsights {
  insights: Insight[];
  timestamp: number;
}

const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000;
const STORAGE_KEY = 'ai_insights_cache';

const AIInsights: React.FC = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user, isLoading: isAuthLoading } = useUser();

  const getCachedInsights = (): CachedInsights | null => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (!cached) return null;

      const parsedCache = JSON.parse(cached);
      return parsedCache;
    } catch (error) {
      console.error('Error reading from cache:', error);
      return null;
    }
  };

  const setCachedInsights = (insights: Insight[]) => {
    try {
      const cacheData: CachedInsights = {
        insights,
        timestamp: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error writing to cache:', error);
    }
  };

  const shouldFetchNewInsights = (): boolean => {
    const cached = getCachedInsights();
    if (!cached) return true;

    const now = Date.now();
    return now - cached.timestamp > CACHE_DURATION;
  };

  const fetchAIInsights = useCallback(async () => {
    if (!user?.id) {
      setError("User not authenticated");
      return;
    }

    const cached = getCachedInsights();
    if (cached && !shouldFetchNewInsights()) {
      setInsights(cached.insights);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/ai/savings?userId=${encodeURIComponent(user.id)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch insights');
      }

      if (data.success && data.data) {
        const geminiResponse = data.data;
        let parsedInsights;

        try {
          let textContent = geminiResponse.candidates[0].content.parts[0].text;

          textContent = textContent
            .replace(/```json\n/g, '')
            .replace(/```\n/g, '')
            .replace(/```/g, '')
            .trim();

          parsedInsights = JSON.parse(textContent);

          if (!Array.isArray(parsedInsights)) {
            parsedInsights = [parsedInsights];
          }

          parsedInsights = parsedInsights.map(insight => ({
            title: insight.title || 'Untitled Insight',
            description: insight.description || '',
            goalName: insight.goalName,
            progress: insight.progress,
            suggestionType: insight.suggestionType
          }));

          // Cache the new insights
          setCachedInsights(parsedInsights);
          setInsights(parsedInsights);
        } catch (parseError) {
          console.error('Error parsing insights:', parseError);
          throw new Error("Invalid insights format received");
        }
      } else {
        throw new Error("No insights data received");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setError(errorMessage);
      toast.error("Error Fetching Insights", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (user?.id) {
      fetchAIInsights();
    }
  }, [user, fetchAIInsights]);

  const handleManualRefresh = () => {
    localStorage.removeItem(STORAGE_KEY);
    fetchAIInsights();
  };




  const getInsightIcon = (index: number) => {
    const icons = [
      <Lightbulb key="icon1" className="h-5 w-5 text-primary" />,
      <TrendingUp key="icon2" className="h-5 w-5 text-chart-1" />,
      <AlertTriangle key="icon3" className="h-5 w-5 text-chart-4" />,
      <Sparkles key="icon4" className="h-5 w-5 text-chart-5" />,
    ];
    return icons[index] || icons[0];
  };

  if (isLoading || isAuthLoading) {
    return (
      <Card className="h-full w-full flex flex-col border-border/50">
        <CardHeader className="pb-2 flex-none">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-6 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </CardHeader>
        <CardContent className="flex-1 min-h-0">
          <div className="h-full pr-2">
            <div className="space-y-3">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-2.5 rounded-xl"
                >
                  <Skeleton className="h-9 w-9 rounded-xl flex-shrink-0" />
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <ErrorState
        error={`${error}. Please try again later.`}
        onRetry={fetchAIInsights}
        className="h-full w-full"
      />
    );
  }

  return (
    <Card className="h-full w-full flex flex-col relative overflow-hidden border-border/50">
      {/* Decorative gradient */}
      <div className="absolute -top-16 -left-16 w-32 h-32 rounded-full bg-purple-500/10 blur-3xl" />
      <div className="absolute -bottom-16 -right-16 w-32 h-32 rounded-full bg-primary/10 blur-3xl" />

      <CardHeader className="pb-2 flex-none relative z-10">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <span className="text-sm font-semibold">AI Recommendations</span>
            <div className="p-1 rounded-lg bg-gradient-to-br from-purple-500/20 to-primary/10">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
            </div>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleManualRefresh}
            disabled={isLoading}
            className="h-8 px-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 relative z-10">
        <div className="h-full overflow-y-auto styled-scrollbar pr-2">
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-2.5 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors duration-200"
              >
                <div className="flex-shrink-0 p-2 rounded-xl bg-card">
                  {getInsightIcon(index)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{insight.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                    {insight.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIInsights;
