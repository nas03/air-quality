import { statusCode } from '@/config/constant';
import { MRecommendationController } from '@/domain/controllers';
import { MRecommendationInteractor } from '@/domain/interactors';
import { MRecommendation } from '@/entities';
import { Request, Response } from 'express';
import { mock } from 'jest-mock-extended';

describe('MRecommendationController', () => {
  let controller: MRecommendationController;
  let mockInteractor: MRecommendationInteractor;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockInteractor = mock<MRecommendationInteractor>();
    controller = new MRecommendationController(mockInteractor);
    
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('onGetAllRecommendation', () => {
    it('should return success status and recommendations data', async () => {
      // Arrange
      const mockRecommendations = [
        new MRecommendation('green', 1, 50, 0, 'Good air quality', 'Chất lượng không khí tốt', 'Tốt', 'Good'),
        new MRecommendation('yellow', 2, 100, 51, 'Moderate air quality', 'Chất lượng không khí trung bình', 'Trung bình', 'Moderate')
      ];
      mockInteractor.getAllRecommendations = jest.fn().mockResolvedValueOnce(mockRecommendations);

      // Act
      await controller.onGetAllRecommendation(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockInteractor.getAllRecommendations).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(statusCode.SUCCESS);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'success',
        data: mockRecommendations
      });
    });

    it('should handle empty recommendations array', async () => {
      // Arrange
      mockInteractor.getAllRecommendations = jest.fn().mockResolvedValueOnce([]);

      // Act
      await controller.onGetAllRecommendation(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(statusCode.SUCCESS);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'success',
        data: []
      });
    });

    it('should propagate interactor errors', async () => {
      // Arrange
      const interactorError = new Error('Interactor error');
      mockInteractor.getAllRecommendations = jest.fn().mockRejectedValueOnce(interactorError);

      // Act & Assert
      await expect(controller.onGetAllRecommendation(mockRequest as Request, mockResponse as Response))
        .rejects.toThrow(interactorError);
    });
  });
});