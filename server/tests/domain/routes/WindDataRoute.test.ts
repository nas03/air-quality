import { WindDataController } from '@/domain/controllers';
import express from 'express';
import request from 'supertest';

// Mock the interactor dependency
jest.mock('@/domain/interactors/WindDataInteractor', () => {
  return {
    WindDataInteractor: jest.fn().mockImplementation(() => ({
      getWindData: jest.fn()
    }))
  };
});

describe('Wind Data API Routes', () => {
  let app: any;
  let mockController: WindDataController;
  
  beforeEach(() => {
    // Create a fresh Express app for each test
    app = express();
    app.use(express.json());
    
    // Create mock controller with spied methods
    const mockInteractor = { 
      getWindData: jest.fn()
    };
    mockController = new WindDataController(mockInteractor as any);
    
    // Spy on controller methods
    jest.spyOn(mockController, 'onGetWindData');
    
    // Setup routes directly on the app to avoid TypeScript errors
    app.get('/api/wind-data', (req, res) => mockController.onGetWindData(req, res));
    
    // Add error handling middleware
    app.use((err: Error, req: any, res: any, next: any) => {
      res.status(500).json({ status: 'error', message: err.message });
    });
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  describe('GET /wind-data', () => {
    it('should return wind data with 200 status code', async () => {
      // Arrange
      const mockWindData = [
        { id: 1, direction: 'NE', speed: 15, timestamp: '2025-04-14T12:00:00Z' },
        { id: 2, direction: 'SW', speed: 22, timestamp: '2025-04-14T13:00:00Z' }
      ];
      
      // Mock the controller to return mock data
      (mockController as any).windDataInteractor.getWindData.mockResolvedValueOnce(mockWindData);
      
      // Act
      const response = await request(app).get('/api/wind-data');
      
      // Assert
      expect(response.status).toBe(200);
      expect(mockController.onGetWindData).toHaveBeenCalled();
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty('data', mockWindData);
    });
    
    it('should handle empty wind data array', async () => {
      // Arrange
      (mockController as any).windDataInteractor.getWindData.mockResolvedValueOnce([]);
      
      // Act
      const response = await request(app).get('/api/wind-data');
      
      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'success',
        data: []
      });
    });
    
    it('should handle errors properly', async () => {
      // Arrange
      const errorMessage = 'Database error';
      (mockController as any).windDataInteractor.getWindData.mockRejectedValueOnce(new Error(errorMessage));
      
      // Act
      const response = await request(app).get('/api/wind-data');
      
      // Assert
      expect(response.status).toBe(500);
    });
  });
});