import { describe, it, expect, vi, beforeEach } from "vitest";
import { getUserData, updateUserProfile } from "./user";
import pool from "@/database/db";

vi.mock("@/database/db", () => ({
  default: {
    query: vi.fn(),
  },
}));

const mockPool = pool as unknown as { query: ReturnType<typeof vi.fn> };

describe("getUserData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should throw error when userId is not provided", async () => {
    await expect(getUserData("")).rejects.toThrow("User ID is required");
  });

  it("should return user data when found", async () => {
    const mockUser = {
      id: "123",
      email: "test@example.com",
      fullname: "Test User",
    };

    mockPool.query.mockResolvedValueOnce({
      rows: [mockUser],
    });

    const result = await getUserData("123");
    expect(result).toEqual(mockUser);
    expect(mockPool.query).toHaveBeenCalledWith(
      "SELECT * FROM users WHERE id = $1",
      ["123"]
    );
  });

  it("should throw error when user not found", async () => {
    mockPool.query.mockResolvedValueOnce({
      rows: [],
    });

    await expect(getUserData("123")).rejects.toThrow("User not found");
  });

  it("should handle database errors", async () => {
    const dbError = new Error("Database connection failed");
    mockPool.query.mockRejectedValueOnce(dbError);

    await expect(getUserData("123")).rejects.toThrow(
      "Database connection failed"
    );
  });
});

describe("updateUserProfile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should update user profile successfully", async () => {
    const mockUpdatedUser = {
      id: "123",
      email: "test@example.com",
      fullname: "Updated Name",
      avatar_url: "https://example.com/avatar.jpg",
    };

    mockPool.query.mockResolvedValueOnce({
      rows: [mockUpdatedUser],
    });

    const result = await updateUserProfile("123", {
      fullname: "Updated Name",
      avatarUrl: "https://example.com/avatar.jpg",
    });

    expect(result).toEqual(mockUpdatedUser);
    expect(mockPool.query).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE users"),
      ["Updated Name", "https://example.com/avatar.jpg", "123"]
    );
  });

  it("should handle database errors", async () => {
    const dbError = new Error("Update failed");
    mockPool.query.mockRejectedValueOnce(dbError);

    await expect(
      updateUserProfile("123", {
        fullname: "Test",
        avatarUrl: "https://example.com/avatar.jpg",
      })
    ).rejects.toThrow("Update failed");
  });
});
