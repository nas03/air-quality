import { describe, expect, it } from "vitest";
import api from "../config/api";

describe("District API", () => {
    // Tests for district routes

    describe("GET /districts", () => {
        it("should retrieve all districts", async () => {
            const res = await api.get("/api/districts");

            // Status check
            expect(res.status).toBe(200);

            // Response validation
            expect(res.body).toHaveProperty("data");
            expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    describe("GET /districts/:district_id", () => {
        it("should retrieve a specific district by ID", async () => {
            const districtId = "VNM.63.8_1";

            const res = await api.get(`/api/districts/${districtId}`);

            // Status check
            expect(res.status).toBe(200);

            // Response validation
            expect(res.body).toHaveProperty("data");

            expect(res.body.data).toHaveProperty("district_id", districtId);
        });

        it("should return 404 for non-existent district ID", async () => {
            const nonExistentId = "999999"; // Using an ID that shouldn't exist

            const res = await api.get(`/api/districts/${nonExistentId}`);

            // Status check
            expect(res.status).toBe(200);
            expect(res.body.data).toBe(null);
        });
    });
});
