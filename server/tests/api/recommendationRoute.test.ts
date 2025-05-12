import { describe, expect, it } from "vitest";
import api from "../config/api";

describe("GET /recommendations", () => {
	// Setup hook
	/*  before(() => {
        expect(cacheService).toBeDefined();
    }); */

	it("Should return all recommendations", async () => {
		const res = await api.get("/api/recommendations");
		expect(res.statusCode).toBe(200);

		expect(Array.isArray(res.body.data)).toBe(true);
		expect(res.body.data.length).toBeGreaterThan(0);

		const recommendation = res.body.data[0];

		expect(recommendation).toHaveProperty("id");
		expect(recommendation).toHaveProperty("color");
		expect(recommendation).toHaveProperty("min_threshold");
		expect(recommendation).toHaveProperty("max_threshold");
		expect(recommendation).toHaveProperty("en_recommendation");
		expect(recommendation).toHaveProperty("vn_recommendation");
		expect(recommendation).toHaveProperty("en_status");
		expect(recommendation).toHaveProperty("vn_status");

		expect(typeof recommendation.id).toBe("number");
		expect(typeof recommendation.color).toBe("string");
		expect(typeof recommendation.min_threshold).toBe("number");
		expect(typeof recommendation.max_threshold).toBe("number");
		expect(typeof recommendation.en_recommendation).toBe("string");
		expect(typeof recommendation.vn_recommendation).toBe("string");
		expect(typeof recommendation.en_status).toBe("string");
		expect(typeof recommendation.vn_status).toBe("string");
	});
});
