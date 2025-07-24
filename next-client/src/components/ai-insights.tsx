"use client";
import { useState, useCallback, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Loader2,
} from "lucide-react";
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

  const { user } = useUser();

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
          console.log('Raw text content:', geminiResponse.candidates[0].content.parts[0].text);
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
      <Lightbulb key="icon1" className="h-9 w-9 text-primary mt-0.5" />,
      <TrendingUp key="icon2" className="h-9 w-9 text-green-500 mt-0.5" />,
      <AlertTriangle key="icon3" className="h-9 w-9 text-amber-500 mt-0.5" />,
      <Sparkles key="icon4" className="h-9 w-9 text-purple-500 mt-0.5" />,
    ];
    return icons[index] || icons[0];
  };

  if (isLoading) {
    return (
      <Card className="h-full w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full w-full flex flex-col items-center justify-center p-4">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-sm text-muted-foreground text-center">
          {error}. Please try again later.
        </p>
        <Button onClick={fetchAIInsights} className="mt-4">
          Retry
        </Button>
      </Card>
    );
  }

  return (
    <Card className="h-full w-full flex flex-col">
      <CardHeader className="pb-2 flex-none">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <span className="text-sm">AI recommendations </span>
            <Sparkles className="h-4 w-5 text-primary mt-0.5" />
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleManualRefresh}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        <div className="h-full overflow-y-auto styled-scrollbar pr-2">
          <div className="flex flex-col justify-start gap-4">
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-2 rounded-lg"
                >
                  {getInsightIcon(index)}
                  <div>
                    <p className="text-sm font-medium">{insight.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {insight.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIInsights;
