// import { describe, expect, it } from "vitest";
// import api from "../config/api";

// describe("User API", () => {
//     // Setup hook for all user tests

//     describe("POST /users/signup", () => {
//         it("should create a new user with valid credentials", async () => {
//             const userData = {
//                 username: "testuser",
//                 email: "test@example.com",
//                 password: "Password123!",
//                 phone_number: "0123456789",
//             };

//             const res = await api.post("/api/users/signup").send(userData);

//             // Status check
//             expect(res.status).toBe(200);

//             // Response validation
//             expect(res.body).toHaveProperty("data");
//             expect(res.body.data).toHaveProperty("username", userData.username);
//         });
//     });
// });
