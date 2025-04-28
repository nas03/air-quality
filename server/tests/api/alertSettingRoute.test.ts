import { describe, expect, it } from "vitest";
import api from "../config/api";

describe("Alert Setting API", () => {
    const district_id = "VNM.63.8_1";
    const coordinate = { lat: 21.0, lon: 105.87 };
    const user_id = 38;
    let alertId: number | null = null;

    describe("GET /alert-settings/location", () => {
        it("should get weather data by coordinate", async () => {
            const res = await api.get("/api/alert-settings/location").query({ ...coordinate });
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("data");
            expect(res.body.data).toHaveProperty("temperature");
            expect(res.body.data).toHaveProperty("weather");
            expect(res.body.data).toHaveProperty("wind_speed");
            expect(res.body.data).toHaveProperty("date");
        });

        it("should get weather data by district_id", async () => {
            const res = await api.get("/api/alert-settings/location").query({ district_id });
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty("data");
            expect(res.body.data).toHaveProperty("temperature");
            expect(res.body.data).toHaveProperty("weather");
            expect(res.body.data).toHaveProperty("wind_speed");
            expect(res.body.data).toHaveProperty("date");
        });
    });

    describe("POST /alert-settings", () => {
        it("should create a new alert setting (requires auth)", async () => {
            const payload = {
                aqi_index: true,
                district_id: district_id,
                pm_25: true,
                temperature: true,
                user_id: user_id,
                weather: true,
                wind_speed: true,
                receive_notifications: 2,
            };
            const res = await api.post("/api/alert-settings").send(payload);
            expect([201, 200]).toContain(res.status);
            expect(res.body).toHaveProperty("data");

            alertId = res.body.data.id;
        });
    });

    /*  describe("GET /alert-settings/user", () => {
            it("should get user alert by district (requires auth)", async () => {
                const res = await api.get("/api/alert-settings/user").query({ district_id });
                expect([200]).toContain(res.status);
            });
        });

        describe("PUT /alert-settings/:id", () => {
            it("should update an alert setting (requires auth)", async () => {
                // Replace 1 with a valid alert setting id
                const res = await api
                    .put(`/api/alert-settings/${alertId}`)
                    .send({ aqi_index: false });
                expect([200, 401, 403, 404]).toContain(res.status); // Acceptable: success, unauthorized, not found
                expect(res.body.data.aqi_index).toBe(false);
            });
        }); */

    describe("DELETE /alert-settings/:id", () => {
        it("should delete an alert setting (requires auth)", async () => {
            const res = await api.delete(`/api/alert-settings/${alertId}`);
            expect([200]).toContain(res.status); // Acceptable: success, unauthorized, not found
        });
    });

    /*  describe("GET /user/:user_id/alert-settings", () => {
            it("should get alert settings by user id", async () => {
                // Replace 1 with a valid user id
                const res = await api.get("/api/user/1/alert-settings");
                expect([200, 404]).toContain(res.status); // Acceptable: success or not found
            });
        }); */

    /*  describe("POST /send-alert", () => {
        it("should send a user alert (requires auth)", async () => {
            // This endpoint may require authentication; add token if needed
            const payload = { user_id: 1, message: "Test alert" };
            const res = await api.post("/api/send-alert").send(payload);
            expect([200, 401, 403, 400]).toContain(res.status); // Acceptable: success, unauthorized, or bad request
        });
    }); */
});
