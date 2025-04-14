import { UserController } from '@/domain/controllers';
import express from 'express';
import request from 'supertest';

// Mock the interactors
jest.mock('@/domain/interactors/UserInteractor', () => {
  return {
    UserInteractor: jest.fn().mockImplementation(() => ({
      createUser: jest.fn(),
      updateUserBasicData: jest.fn(),
      updateUserPassword: jest.fn(),
      getUserInfo: jest.fn()
    }))
  };
});

jest.mock('@/domain/interactors/VerificationCodeInteractor', () => {
  return {
    VerificationCodeInteractor: jest.fn().mockImplementation(() => ({
      createVerificationCode: jest.fn()
    }))
  };
});

describe('User API Routes', () => {
  let app: any;
  let mockController: UserController;
  let mockUserInteractor: any;
  let mockVerificationInteractor: any;
  
  beforeEach(() => {
    // Create a fresh Express app for each test
    app = express();
    app.use(express.json());
    
    // Create mock interactors
    mockUserInteractor = { 
      createUser: jest.fn(),
      updateUserBasicData: jest.fn(),
      updateUserPassword: jest.fn(),
      getUserInfo: jest.fn()
    };
    
    mockVerificationInteractor = {
      createVerificationCode: jest.fn()
    };
    
    // Create controller with mock interactors
    mockController = new UserController(
      mockUserInteractor as any,
      mockVerificationInteractor as any
    );
    
    // Spy on controller methods
    jest.spyOn(mockController, 'onCreateUser');
    jest.spyOn(mockController, 'onUpdateUserBasicData');
    jest.spyOn(mockController, 'onUpdateUserPassword');
    jest.spyOn(mockController, 'onGetUserInfo');
    
    // Setup routes directly on the app to avoid TypeScript errors
    app.post('/api/users/signup', (req, res) => mockController.onCreateUser(req, res));
    app.put('/api/user/update-info', (req, res) => mockController.onUpdateUserBasicData(req, res));
    app.put('/api/user/update-password', (req, res) => mockController.onUpdateUserPassword(req, res));
    app.get('/api/user/:user_id', (req, res) => mockController.onGetUserInfo(req, res));
    
    // Add error handling middleware
    app.use((err: Error, req: any, res: any, next: any) => {
      res.status(500).json({ status: 'error', message: err.message });
    });
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  describe('POST /users/signup', () => {
    it('should create a new user and return 201 status code', async () => {
      // Arrange
      const newUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!'
      };
      
      const createdUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        created_at: '2025-04-14T12:00:00Z'
      };
      
      mockUserInteractor.createUser.mockResolvedValueOnce(createdUser);
      mockVerificationInteractor.createVerificationCode.mockResolvedValueOnce('123456');
      
      // Act
      const response = await request(app)
        .post('/api/users/signup')
        .send(newUser);
      
      // Assert
      expect(response.status).toBe(201);
      expect(mockController.onCreateUser).toHaveBeenCalled();
      expect(mockUserInteractor.createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          name: newUser.name,
          email: newUser.email
        })
      );
      expect(mockVerificationInteractor.createVerificationCode).toHaveBeenCalled();
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty('data');
    });
    
    it('should handle duplicate email error', async () => {
      // Arrange
      const newUser = {
        name: 'Test User',
        email: 'existing@example.com',
        password: 'Password123!'
      };
      
      const duplicateError = new Error('Email already exists');
      duplicateError.name = 'DuplicateEmailError';
      mockUserInteractor.createUser.mockRejectedValueOnce(duplicateError);
      
      // Act
      const response = await request(app)
        .post('/api/users/signup')
        .send(newUser);
      
      // Assert
      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Email already exists');
    });
  });
  
  describe('PUT /user/update-info', () => {
    it('should update user basic info and return 200 status code', async () => {
      // Arrange
      const userId = 1;
      const updateData = {
        user_id: userId,
        name: 'Updated Name',
        address: 'New Address',
        phone: '1234567890'
      };
      
      const updatedUser = {
        id: userId,
        name: 'Updated Name',
        email: 'test@example.com',
        address: 'New Address',
        phone: '1234567890'
      };
      
      mockUserInteractor.updateUserBasicData.mockResolvedValueOnce(updatedUser);
      
      // Act
      const response = await request(app)
        .put('/api/user/update-info')
        .send(updateData);
      
      // Assert
      expect(response.status).toBe(200);
      expect(mockController.onUpdateUserBasicData).toHaveBeenCalled();
      expect(mockUserInteractor.updateUserBasicData).toHaveBeenCalledWith(updateData);
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty('data', updatedUser);
    });
    
    it('should handle user not found error', async () => {
      // Arrange
      const updateData = {
        user_id: 999,
        name: 'Updated Name'
      };
      
      mockUserInteractor.updateUserBasicData.mockResolvedValueOnce(null);
      
      // Act
      const response = await request(app)
        .put('/api/user/update-info')
        .send(updateData);
      
      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'User not found');
    });
  });
  
  describe('PUT /user/update-password', () => {
    it('should update user password and return 200 status code', async () => {
      // Arrange
      const passwordData = {
        user_id: 1,
        old_password: 'OldPassword123',
        new_password: 'NewPassword123'
      };
      
      mockUserInteractor.updateUserPassword.mockResolvedValueOnce(true);
      
      // Act
      const response = await request(app)
        .put('/api/user/update-password')
        .send(passwordData);
      
      // Assert
      expect(response.status).toBe(200);
      expect(mockController.onUpdateUserPassword).toHaveBeenCalled();
      expect(mockUserInteractor.updateUserPassword).toHaveBeenCalledWith(
        passwordData.user_id,
        passwordData.old_password,
        passwordData.new_password
      );
      expect(response.body).toHaveProperty('status', 'success');
    });
    
    it('should return 401 for incorrect old password', async () => {
      // Arrange
      const passwordData = {
        user_id: 1,
        old_password: 'WrongOldPassword',
        new_password: 'NewPassword123'
      };
      
      mockUserInteractor.updateUserPassword.mockResolvedValueOnce(false);
      
      // Act
      const response = await request(app)
        .put('/api/user/update-password')
        .send(passwordData);
      
      // Assert
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Incorrect old password');
    });
  });
  
  describe('GET /user/:user_id', () => {
    it('should return user info with 200 status code', async () => {
      // Arrange
      const userId = 1;
      const userInfo = {
        id: userId,
        name: 'Test User',
        email: 'test@example.com',
        created_at: '2025-04-14T12:00:00Z'
      };
      
      mockUserInteractor.getUserInfo.mockResolvedValueOnce(userInfo);
      
      // Act
      const response = await request(app)
        .get(`/api/user/${userId}`);
      
      // Assert
      expect(response.status).toBe(200);
      expect(mockController.onGetUserInfo).toHaveBeenCalled();
      expect(mockUserInteractor.getUserInfo).toHaveBeenCalledWith(userId.toString());
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty('data', userInfo);
    });
    
    it('should return 404 for non-existent user', async () => {
      // Arrange
      const userId = 999;
      mockUserInteractor.getUserInfo.mockResolvedValueOnce(null);
      
      // Act
      const response = await request(app)
        .get(`/api/user/${userId}`);
      
      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'User not found');
    });
  });
});