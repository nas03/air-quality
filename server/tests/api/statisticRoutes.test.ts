import { describe, expect, it } from "vitest";
import api from "../config/api";

describe("Statistics API", () => {
    describe("GET /statistics/district/:district_id", () => {
        it("should retrieve statistics for a specific district", async () => {
            // Using a sample district ID for testing
            const districtId = "VNM.1.1_1"; // Replace with a valid district ID for testing
            const date = "2025-04-12";
            const res = await api.get(`/api/statistics/district/${districtId}?date=${date}`);

            // Status check
            expect(res.status).toBe(200);

            // Response validation
            expect(res.body).toHaveProperty("data");
            expect(res.body.data[0]).toHaveProperty("district_id", districtId);
        });
    });

    describe("GET /statistics/district/:district_id/history", () => {
        it("should retrieve historical statistics for a district", async () => {
            // Using a sample district ID for testing
            const districtId = "VNM.63.8_1"; // Replace with a valid district ID for testing
            const start_date = "2025-04-10";
            const end_date = "2025-04-12";
            const res = await api.get(
                `/api/statistics/district/${districtId}/history?start_date=${start_date}&end_date=${end_date}`,
            );

            // Status check
            expect(res.status).toBe(200);

            // Response validation
            expect(res.body).toHaveProperty("data");
            expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    describe("GET /statistics/ranking", () => {
        it("should retrieve rankings by date", async () => {
            const date = "2025-04-12";
            const res = await api.get(`/api/statistics/ranking?date=${date}`);

            // Status check
            expect(res.status).toBe(200);

            // Response validation
            expect(res.body).toHaveProperty("data");
            expect(Array.isArray(res.body.data)).toBe(true);
        });

        it("should accept query parameters for filtering", async () => {
            // Test with date parameter
            const date = "2025-04-12"; // Using current date for testing

            const res = await api.get(`/api/statistics/ranking?date=${date}`);

            // Status check
            expect(res.status).toBe(200);

            // Response validation
            expect(res.body).toHaveProperty("data");
            expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    describe("GET /statistics/average/:province_id", () => {
        it("should retrieve AQI statistics for a province", async () => {
            const provinceId = "VNM.1_1"; // Replace with a valid province ID for testing
            const start_date = "2025-04-10";
            const end_date = "2025-04-12";
            const res = await api.get(
                `/api/statistics/average/${provinceId}?start_date=${start_date}&end_date=${end_date}`,
            );

            // Status check
            expect(res.status).toBe(200);

            // Response validation
            expect(res.body).toHaveProperty("data");
            expect(res.body.data).toHaveProperty("districtsData");
            expect(res.body.data.districtsData.length).toBeGreaterThan(0);
        });
    });
});
