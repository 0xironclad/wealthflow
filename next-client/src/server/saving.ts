import { Saving} from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const getSavings = async (userId: string) => {
    try {
        if (!userId) {
            console.error("Invalid userId provided");
            return [];
        }

        const response = await fetch(`/api/savings?userId=${userId}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error fetching savings: ${response.statusText}`);
        }
        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error("Error in getSavings:", error);
        return [];
    }
}


export const useCreateSaving = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (savingData: Omit<Saving, "id">) => {
      const response = await fetch("/api/savings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({...savingData, userId: String(savingData.userId)}),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `Error adding saving: ${response.statusText}`);
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savings"] });
    },
  });
};
