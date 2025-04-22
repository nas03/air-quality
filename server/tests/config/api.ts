import request from "supertest";
import { afterAll } from "vitest";
import app from "../../src/app";

// Create supertest agent for direct API calls
const api = request(app);

// Clean up after all tests complete
afterAll(() => {
    // Add any cleanup if needed
});

export default api;
