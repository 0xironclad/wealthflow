import { Saving} from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NextResponse } from "next/server";

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


export const useUpdateSaving = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (savingData: Partial<Saving> & { id: number }) => {
      const response = await fetch("/api/savings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(savingData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `Error updating saving: ${response.statusText}`);
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savings"] });
    },
  });
};

export const useDeleteSaving = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch("/api/savings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.message || `Error deleting saving: ${response.statusText}`)
      }
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savings"] })
      queryClient.invalidateQueries({ queryKey: ["expenses"] })
      queryClient.invalidateQueries({ queryKey: ["totalBalance"] })
    },
  })
}


export const getSavingsHistory = async (userId: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }
    const encodedUserId = encodeURIComponent(userId);
    const response = await fetch(
      `${baseUrl}/api/savings/history?userId=${encodedUserId}`
    );
    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: "Error fetching savings history",
          error: response.statusText,
        },
        { status: response.status }
      );
    }
    return response.json();
  } catch (error) {
    console.error("Error in getSavingsHistory:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching savings history",
        error: String(error),
      },
      { status: 500 }
    );
  }
};
