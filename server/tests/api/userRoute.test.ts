import { describe, expect, it } from "vitest";
import api from "../config/api";

// Sample user data for registration and update
const testUser = {
    username: `testuser123_${Date.now()}`,
    email: `testuser123_${Date.now()}@example.com`,
    phone_number: "0123456789",
    password: "TestPassword!123",
};

let createdUserId: number;

describe("User API", () => {
    describe("POST /users/signup", () => {
        it("should register a new user", async () => {
            const res = await api.post("/api/users/signup").send(testUser);
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty("data");
            expect(res.body.data).toHaveProperty("user_id");
            expect(res.body.data).toHaveProperty("username", testUser.username);
            createdUserId = res.body.data.user_id;
        });
    });

    describe("GET /user/:user_id", () => {
        it("should retrieve user info by user_id", async () => {
            const res = await api.get(`/api/user/${createdUserId}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("data");
            expect(res.body.data).toHaveProperty("user_id", createdUserId);
            expect(res.body.data).toHaveProperty("username", testUser.username);
        });
    });

    describe("PUT /user/update-info", () => {
        it("should update user basic info", async () => {
            const updatePayload = {
                user_id: createdUserId,
                username: "updateduser123",
                phone_number: "0987654321",
            };
            const res = await api.put("/api/user/update-info").send(updatePayload);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("status", "success");
        });
    });

    describe("PUT /user/update-password", () => {
        it("should update user password", async () => {
            const updatePasswordPayload = {
                user_id: createdUserId,
                old_password: testUser.password,
                new_password: "NewPassword!456",
            };
            const res = await api.put("/api/user/update-password").send(updatePasswordPayload);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("status", "success");
        });
    });

    describe("DELETE /user/:user_id", () => {
        it("should delete the user by user_id", async () => {
            const res = await api.delete(`/api/user/${createdUserId}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("status", "success");
            const getRes = await api.get(`/api/user/${createdUserId}`);
            expect(getRes.body.data).toBe(null);
        });
    });
});
