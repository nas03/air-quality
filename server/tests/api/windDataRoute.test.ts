import { describe, expect, it } from "vitest";
import api from "../config/api";

describe("Wind Data API", () => {
    describe("GET /wind-data", () => {
        it("should retrieve wind data", async () => {
            const timestamp = "2025-04-12";
            const res = await api.get(`/api/wind-data?timestamp=${timestamp}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("data");
            // Optionally check structure if you know the fields
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data).toHaveLength(2);
            expect(res.body.data[0]).toHaveProperty("header");
            expect(res.body.data[0]).toHaveProperty("data");
            expect(res.body.data[1]).toHaveProperty("header");
            expect(res.body.data[1]).toHaveProperty("data");
        });
    });
});
