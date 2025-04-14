import { MRecommendationRepository } from '@/domain/repositories';
import { MRecommendation } from '@/entities';

// Mock the database instance
jest.mock('@/config/db', () => ({
  db: {
    selectFrom: jest.fn().mockReturnThis(),
    selectAll: jest.fn().mockReturnThis(),
    execute: jest.fn()
  }
}));

describe('MRecommendationRepository', () => {
  let repository: MRecommendationRepository;
  const mockDb = require('@/config/db').db;
  
  beforeEach(() => {
    repository = new MRecommendationRepository();
    jest.clearAllMocks();
  });

  describe('getAllRecommendations', () => {
    it('should return all recommendations from the database', async () => {
      // Arrange
      const mockRecommendations = [
        new MRecommendation('green', 1, 50, 0, 'Good air quality', 'Chất lượng không khí tốt', 'Tốt', 'Good'),
        new MRecommendation('yellow', 2, 100, 51, 'Moderate air quality', 'Chất lượng không khí trung bình', 'Trung bình', 'Moderate')
      ];
      mockDb.execute.mockResolvedValueOnce(mockRecommendations);

      // Act
      const result = await repository.getAllRecommendations();

      // Assert
      expect(mockDb.selectFrom).toHaveBeenCalledWith('m_recommendation');
      expect(mockDb.selectAll).toHaveBeenCalled();
      expect(mockDb.execute).toHaveBeenCalled();
      expect(result).toEqual(mockRecommendations);
    });

    it('should handle empty results', async () => {
      // Arrange
      mockDb.execute.mockResolvedValueOnce([]);

      // Act
      const result = await repository.getAllRecommendations();

      // Assert
      expect(result).toEqual([]);
    });

    it('should propagate database errors', async () => {
      // Arrange
      const dbError = new Error('Database connection error');
      mockDb.execute.mockRejectedValueOnce(dbError);

      // Act & Assert
      await expect(repository.getAllRecommendations()).rejects.toThrow(dbError);
    });
  });
});