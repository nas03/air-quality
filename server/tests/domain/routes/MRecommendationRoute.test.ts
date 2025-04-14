import { MRecommendationController } from '@/domain/controllers';
import { MRecommendation } from '@/entities';
import express from 'express';
import request from 'supertest';

// Mock the interactor dependency
jest.mock('@/domain/interactors/MRecommendationInteractor', () => {
  return {
    MRecommendationInteractor: jest.fn().mockImplementation(() => ({
      getAllRecommendations: jest.fn()
    }))
  };
});

describe('Recommendation API Routes', () => {
  let app: any;
  let mockController: MRecommendationController;
  
  beforeEach(() => {
    // Create a fresh Express app for each test
    app = express();
    app.use(express.json());
    
    // Create mock controller with spied methods
    const mockInteractor = { getAllRecommendations: jest.fn() };
    mockController = new MRecommendationController(mockInteractor as any);
    
    // Spy on controller method
    jest.spyOn(mockController, 'onGetAllRecommendation');
    
    // Setup the routes - use the handler function approach to avoid TypeScript errors
    app.get('/api/recommendation', (req, res) => mockController.onGetAllRecommendation(req, res));
    
    // Add error handling middleware
    app.use((err: Error, req: any, res: any, next: any) => {
      res.status(500).json({ status: 'error', message: err.message });
    });
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  describe('GET /recommendation', () => {
    it('should return list of recommendations with 200 status code', async () => {
      // Arrange
      const mockRecommendations = [
        new MRecommendation('green', 1, 50, 0, 'Good air quality', 'Chất lượng không khí tốt', 'Tốt', 'Good'),
        new MRecommendation('yellow', 2, 100, 51, 'Moderate air quality', 'Chất lượng không khí trung bình', 'Trung bình', 'Moderate')
      ];
      
      // Mock the controller to return mock data
      (mockController as any).mRecommendationInteractor.getAllRecommendations.mockResolvedValueOnce(mockRecommendations);
      
      // Act
      const response = await request(app).get('/api/recommendation');
      
      // Assert
      expect(response.status).toBe(200);
      expect(mockController.onGetAllRecommendation).toHaveBeenCalled();
      expect(response.body).toEqual({
        status: 'success',
        data: mockRecommendations
      });
    });
    
    it('should handle empty recommendations array', async () => {
      // Arrange
      (mockController as any).mRecommendationInteractor.getAllRecommendations.mockResolvedValueOnce([]);
      
      // Act
      const response = await request(app).get('/api/recommendation');
      
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
      (mockController as any).mRecommendationInteractor.getAllRecommendations.mockRejectedValueOnce(new Error(errorMessage));
      
      // Act
      const response = await request(app).get('/api/recommendation');
      
      // Assert
      expect(response.status).toBe(500);
    });
  });
});