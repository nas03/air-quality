/* import { describe, expect, it } from "vitest";
import api from "../config/api";

describe("Cronjob Monitor API", () => {
    describe("GET /cronjob/record/all", () => {
        it("should retrieve all cronjob records", async () => {
            const res = await api.get("/api/cronjob/record/all");

            // Status check
            expect(res.status).toBe(200);

            // Response validation
            expect(res.body).toHaveProperty("data");
            expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    describe("GET /cronjob/record", () => {
        it("should retrieve a specific cronjob record with query parameters", async () => {
            // Sample query parameters for testing
            const jobName = "aqi_calculation";
            const status = "success";
            
            const res = await api.get(`/api/cronjob/record?job_name=${jobName}&status=${status}`);

            // Status check
            expect(res.status).toBe(200);

            // Response validation
            expect(res.body).toHaveProperty("data");
            if (res.body.data.length > 0) {
                expect(res.body.data[0]).toHaveProperty("job_name", jobName);
                expect(res.body.data[0]).toHaveProperty("status", status);
            }
        });
    });

    describe("POST /cronjob/record", () => {
        it("should create a new cronjob record", async () => {
            const recordData = {
                job_name: "test_job",
                status: "success",
                execution_time: 120,
                message: "Test job completed successfully",
                timestamp: new Date().toISOString(),
            };

            const res = await api.post("/api/cronjob/record").send(recordData);

            // Status check
            expect(res.status).toBe(200);

            // Response validation
            expect(res.body).toHaveProperty("data");
            expect(res.body.data).toHaveProperty("job_name", recordData.job_name);
            expect(res.body.data).toHaveProperty("status", recordData.status);
        });
    });

    describe("POST /cronjob/rerun", () => {
        it("should rerun a specified cronjob", async () => {
            const rerunData = {
                job_name: "aqi_calculation",
                parameters: {
                    date: "2025-04-15",
                },
            };

            const res = await api.post("/api/cronjob/rerun").send(rerunData);

            // Status check
            expect(res.status).toBe(200);

            // Response validation
            expect(res.body).toHaveProperty("message");
            expect(res.body.message).toContain("rerun");
        });
    });

    describe("PUT /cronjob/record/:id", () => {
        it("should update an existing cronjob record", async () => {
            // For this test we'd need an existing record ID
            // First, let's create a record to update
            const createData = {
                job_name: "update_test_job",
                status: "running",
                execution_time: 0,
                message: "Job is running",
                timestamp: new Date().toISOString(),
            };

            const createRes = await api.post("/api/cronjob/record").send(createData);
            expect(createRes.status).toBe(200);
            const recordId = createRes.body.data.id;

            // Now update the record
            const updateData = {
                status: "success",
                execution_time: 150,
                message: "Job completed successfully",
            };

            const res = await api.put(`/api/cronjob/record/${recordId}`).send(updateData);

            // Status check
            expect(res.status).toBe(200);

            // Response validation
            expect(res.body).toHaveProperty("data");
            expect(res.body.data).toHaveProperty("id", recordId);
            expect(res.body.data).toHaveProperty("status", updateData.status);
            expect(res.body.data).toHaveProperty("execution_time", updateData.execution_time);
        });
    });
}); */