import { DistrictController } from "@/domain/controllers";
import express from "express";
import request from "supertest";

// Mock the interactor dependency
jest.mock("@/domain/interactors/DistrictInteractor", () => {
    return {
        DistrictInteractor: jest.fn().mockImplementation(() => ({
            findAllDistricts: jest.fn(),
            findDistrictById: jest.fn(),
        })),
    };
});

describe("District API Routes", () => {
    let app: any;
    let mockController: DistrictController;

    beforeEach(() => {
        // Create a fresh Express app for each test
        app = express();
        app.use(express.json());

        // Create mock controller with spied methods
        const mockInteractor = {
            findAllDistricts: jest.fn(),
            findDistrictById: jest.fn(),
        };
        mockController = new DistrictController(mockInteractor as any);

        // Spy on controller methods
        jest.spyOn(mockController, "onFindAllDistricts");
        jest.spyOn(mockController, "onFindDistrictById");

        // Setup routes directly on the app to avoid TypeScript errors
        app.get("/api/districts", (req, res) => mockController.onFindAllDistricts(req, res));
        app.get("/api/districts/:district_id", (req, res) =>
            mockController.onFindDistrictById(req, res)
        );

        // Add error handling middleware
        app.use((err: Error, req: any, res: any, next: any) => {
            res.status(500).json({ status: "error", message: err.message });
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /districts", () => {
        it("should return list of all districts with 200 status code", async () => {
            // Arrange
            const mockDistricts = [
                { id: 1, name: "District 1", province_id: 1 },
                { id: 2, name: "District 2", province_id: 1 },
            ];

            // Mock the controller to return mock data
            (mockController as any).districtInteractor.findAllDistricts.mockResolvedValueOnce(
                mockDistricts
            );

            // Act
            const response = await request(app).get("/api/districts");

            // Assert
            expect(response.status).toBe(200);
            expect(mockController.onFindAllDistricts).toHaveBeenCalled();
            expect(response.body).toHaveProperty("status", "success");
            expect(response.body).toHaveProperty("data", mockDistricts);
        });

        it("should handle empty districts array", async () => {
            // Arrange
            (mockController as any).districtInteractor.findAllDistricts.mockResolvedValueOnce([]);

            // Act
            const response = await request(app).get("/api/districts");

            // Assert
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                status: "success",
                data: [],
            });
        });

        it("should handle errors properly", async () => {
            // Arrange
            const errorMessage = "Database error";
            (mockController as any).districtInteractor.findAllDistricts.mockRejectedValueOnce(
                new Error(errorMessage)
            );

            // Act
            const response = await request(app).get("/api/districts");

            // Assert
            expect(response.status).toBe(500);
        });
    });

    describe("GET /districts/:district_id", () => {
        it("should return a specific district by ID with 200 status code", async () => {
            // Arrange
            const mockDistrict = { id: 1, name: "District 1", province_id: 1 };
            const districtId = 1;

            // Mock the controller to return mock data
            (mockController as any).districtInteractor.findDistrictById.mockResolvedValueOnce(
                mockDistrict
            );

            // Act
            const response = await request(app).get(`/api/districts/${districtId}`);

            // Assert
            expect(response.status).toBe(200);
            expect(mockController.onFindDistrictById).toHaveBeenCalled();
            expect(response.body).toHaveProperty("status", "success");
            expect(response.body).toHaveProperty("data", mockDistrict);
        });

        it("should handle district not found case", async () => {
            // Arrange
            const districtId = 999; // Non-existent ID
            (mockController as any).districtInteractor.findDistrictById.mockResolvedValueOnce(null);

            // Act
            const response = await request(app).get(`/api/districts/${districtId}`);

            // Assert
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty("status", "error");
            expect(response.body).toHaveProperty("message", "District not found");
        });

        it("should handle errors properly", async () => {
            // Arrange
            const errorMessage = "Database error";
            const districtId = 1;
            (mockController as any).districtInteractor.findDistrictById.mockRejectedValueOnce(
                new Error(errorMessage)
            );

            // Act
            const response = await request(app).get(`/api/districts/${districtId}`);

            // Assert
            expect(response.status).toBe(500);
        });
    });
});
