import { AuthController } from "@/domain/controllers";
import express from "express";
import request from "supertest";

// Mock the interactor dependency
jest.mock("@/domain/interactors/UserInteractor", () => {
    return {
        UserInteractor: jest.fn().mockImplementation(() => ({
            findUserByEmail: jest.fn(),
            validateUserPassword: jest.fn(),
        })),
    };
});

jest.mock("@/domain/interactors/VerificationCodeInteractor", () => {
    return {
        VerificationCodeInteractor: jest.fn().mockImplementation(() => ({
            verifyCode: jest.fn(),
            createVerificationCode: jest.fn(),
        })),
    };
});

describe("Auth API Routes", () => {
    let app: any;
    let mockController: AuthController;
    let mockUserInteractor: any;
    let mockVerificationInteractor: any;

    beforeEach(() => {
        // Create a fresh Express app for each test
        app = express();
        app.use(express.json());

        // Create mock interactors and controller
        mockUserInteractor = {
            findUserByEmail: jest.fn(),
            validateUserPassword: jest.fn(),
        };

        mockVerificationInteractor = {
            verifyCode: jest.fn(),
            createVerificationCode: jest.fn(),
        };

        mockController = new AuthController(
            mockUserInteractor as any,
            mockVerificationInteractor as any
        );

        // Spy on controller methods
        jest.spyOn(mockController, "onSignin");
        jest.spyOn(mockController, "onVerifyVerificationCode");
        jest.spyOn(mockController, "onRotateRefreshToken");

        // Setup routes directly on the app to avoid TypeScript errors
        app.post("/api/auth/signin", (req, res) => mockController.onSignin(req, res));
        app.post("/api/auth/verification/:code", (req, res) => mockController.onVerifyVerificationCode(req, res));
        app.post("/api/auth/refresh-token", (req, res) => mockController.onRotateRefreshToken(req, res));

        // Add error handling middleware
        app.use((err: Error, req: any, res: any, next: any) => {
            res.status(500).json({ status: "error", message: err.message });
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("POST /auth/signin", () => {
        it("should return user data and tokens with 200 status code on successful login", async () => {
            // Arrange
            const mockUser = {
                id: 1,
                email: "test@example.com",
                name: "Test User",
                password: "hashedPassword",
            };

            const mockCredentials = {
                email: "test@example.com",
                password: "password123",
            };

            const mockTokens = {
                accessToken: "mock-access-token",
                refreshToken: "mock-refresh-token",
            };

            mockUserInteractor.findUserByEmail.mockResolvedValueOnce(mockUser);
            mockUserInteractor.validateUserPassword.mockResolvedValueOnce(true);

            // Mock the internal methods of the controller that generate tokens
            const mockGenerateTokens = jest
                .spyOn(AuthController.prototype as any, "generateTokens")
                .mockResolvedValueOnce(mockTokens);

            // Act
            const response = await request(app).post("/api/auth/signin").send(mockCredentials);

            // Assert
            expect(response.status).toBe(200);
            expect(mockController.onSignin).toHaveBeenCalled();
            expect(mockUserInteractor.findUserByEmail).toHaveBeenCalledWith(mockCredentials.email);
            expect(mockUserInteractor.validateUserPassword).toHaveBeenCalled();
            expect(response.body).toHaveProperty("status", "success");
            expect(response.body).toHaveProperty("data");
            expect(response.body.data).toHaveProperty("accessToken");
            expect(response.body.data).toHaveProperty("refreshToken");

            // Clean up mocks
            mockGenerateTokens.mockRestore();
        });

        it("should return 401 for invalid credentials", async () => {
            // Arrange
            const mockCredentials = {
                email: "test@example.com",
                password: "wrongpassword",
            };

            mockUserInteractor.findUserByEmail.mockResolvedValueOnce({
                id: 1,
                email: "test@example.com",
            });
            mockUserInteractor.validateUserPassword.mockResolvedValueOnce(false);

            // Act
            const response = await request(app).post("/api/auth/signin").send(mockCredentials);

            // Assert
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty("status", "error");
            expect(response.body).toHaveProperty("message", "Invalid credentials");
        });

        it("should return 404 for non-existent user", async () => {
            // Arrange
            const mockCredentials = {
                email: "nonexistent@example.com",
                password: "password123",
            };

            mockUserInteractor.findUserByEmail.mockResolvedValueOnce(null);

            // Act
            const response = await request(app).post("/api/auth/signin").send(mockCredentials);

            // Assert
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty("status", "error");
            expect(response.body).toHaveProperty("message", "User not found");
        });
    });

    describe("POST /auth/verification/:code", () => {
        it("should verify a valid code", async () => {
            // Arrange
            const verificationCode = "123456";
            const userId = 1;

            mockVerificationInteractor.verifyCode.mockResolvedValueOnce(true);

            // Act
            const response = await request(app)
                .post(`/api/auth/verification/${verificationCode}`)
                .send({ user_id: userId });

            // Assert
            expect(response.status).toBe(200);
            expect(mockController.onVerifyVerificationCode).toHaveBeenCalled();
            expect(mockVerificationInteractor.verifyCode).toHaveBeenCalledWith(
                verificationCode,
                userId
            );
            expect(response.body).toHaveProperty("status", "success");
        });

        it("should return 400 for an invalid code", async () => {
            // Arrange
            const verificationCode = "invalid";
            const userId = 1;

            mockVerificationInteractor.verifyCode.mockResolvedValueOnce(false);

            // Act
            const response = await request(app)
                .post(`/api/auth/verification/${verificationCode}`)
                .send({ user_id: userId });

            // Assert
            expect(response.status).toBe(400);
            expect(mockVerificationInteractor.verifyCode).toHaveBeenCalledWith(
                verificationCode,
                userId
            );
            expect(response.body).toHaveProperty("status", "error");
            expect(response.body).toHaveProperty("message", "Invalid verification code");
        });
    });

    describe("POST /auth/refresh-token", () => {
        it("should return new tokens with valid refresh token", async () => {
            // Arrange
            const refreshTokenPayload = {
                refreshToken: "valid-refresh-token",
            };

            const newTokens = {
                accessToken: "new-access-token",
                refreshToken: "new-refresh-token",
            };

            // Mock the JWT verification and token generation
            const mockVerifyToken = jest
                .spyOn(AuthController.prototype as any, "verifyRefreshToken")
                .mockResolvedValueOnce({ userId: 1 });

            const mockGenerateTokens = jest
                .spyOn(AuthController.prototype as any, "generateTokens")
                .mockResolvedValueOnce(newTokens);

            // Act
            const response = await request(app)
                .post("/api/auth/refresh-token")
                .send(refreshTokenPayload);

            // Assert
            expect(response.status).toBe(200);
            expect(mockController.onRotateRefreshToken).toHaveBeenCalled();
            expect(response.body).toHaveProperty("status", "success");
            expect(response.body).toHaveProperty("data");
            expect(response.body.data).toHaveProperty("accessToken", newTokens.accessToken);
            expect(response.body.data).toHaveProperty("refreshToken", newTokens.refreshToken);

            // Clean up mocks
            mockVerifyToken.mockRestore();
            mockGenerateTokens.mockRestore();
        });

        it("should return 401 for invalid refresh token", async () => {
            // Arrange
            const refreshTokenPayload = {
                refreshToken: "invalid-refresh-token",
            };

            // Mock the JWT verification failure
            const mockVerifyToken = jest
                .spyOn(AuthController.prototype as any, "verifyRefreshToken")
                .mockRejectedValueOnce(new Error("Invalid refresh token"));

            // Act
            const response = await request(app)
                .post("/api/auth/refresh-token")
                .send(refreshTokenPayload);

            // Assert
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty("status", "error");
            expect(response.body).toHaveProperty("message", "Invalid refresh token");

            // Clean up mock
            mockVerifyToken.mockRestore();
        });
    });
});
