import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock pg module before any imports
const mockQuery = vi.fn();
const mockConnect = vi.fn();
const mockEnd = vi.fn();

class MockPool {
  query = mockQuery;
  connect = mockConnect;
  end = mockEnd;

  constructor(config: Record<string, unknown>) {
    // Store config for assertions
    MockPool.lastConfig = config;
  }

  static lastConfig: Record<string, unknown> | null = null;
}

vi.mock("pg", () => ({
  Pool: MockPool,
}));

describe("Database Connection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("should create pool with Supabase connection string when SUPABASE_DB_URL is set", async () => {
    const originalEnv = process.env.SUPABASE_DB_URL;
    process.env.SUPABASE_DB_URL = "postgresql://user:pass@host:5432/db";

    // Dynamic import to get fresh module
    const dbModule = await import("./db");
    const pool = dbModule.default;

    expect(MockPool.lastConfig).toEqual({
      connectionString: "postgresql://user:pass@host:5432/db",
      ssl: {
        rejectUnauthorized: false,
      },
    });

    expect(pool).toBeDefined();
    expect(pool.query).toBe(mockQuery);

    process.env.SUPABASE_DB_URL = originalEnv;
  });

  it("should export a Pool instance", async () => {
    const dbModule = await import("./db");
    const pool = dbModule.default;

    expect(pool).toBeDefined();
    expect(typeof pool.query).toBe("function");
  });
});
