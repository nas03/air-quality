import { describe, it, expect } from "vitest";
import api from "../config/api";

describe("Stations API", () => {
    // Setup that runs once before all tests in this block
    /*   before(() => {
    // Verify the cache service is available
    expect(cacheService).toBeDefined();
  }); */

    describe("GET /stations", () => {
        it("should return all stations with valid data", async () => {
            const testDate = "2025-04-12";
            const res = await api.get(`/api/stations?date=${testDate}`);

            // Status code check
            expect(res.status).toBe(200);

            // Response structure checks
            expect(res.body).toHaveProperty("data");
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.length).toBeGreaterThan(0);

            // Sample data validation
            const station = res.body.data[0];
            expect(station).toHaveProperty("station_id");
            expect(station).toHaveProperty("station_name");
            expect(typeof station.station_id).toBe("string");
            expect(typeof station.station_name).toBe("string");
        });
    });

    describe("GET /stations/:station_id", () => {
        it("should return the correct station data when given a valid ID and date", async () => {
            const stationId = "14";
            const date = "2025-04-14";

            const res = await api.get(`/api/stations/${stationId}?date=${date}`);

            // Status and structure checks
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("data");
            expect(res.body.data).toHaveProperty("station_id", stationId);

            // Type checks for important properties
            expect(typeof res.body.data.station_name).toBe("string");
        });
    });
});
