import { MRecommendationInteractor } from '@/domain/interactors';
import { MRecommendationRepository } from '@/domain/repositories';
import { MRecommendation } from '@/entities';
import { mock } from 'jest-mock-extended';

describe('MRecommendationInteractor', () => {
  let interactor: MRecommendationInteractor;
  let mockRepository: MRecommendationRepository;

  beforeEach(() => {
    mockRepository = mock<MRecommendationRepository>();
    interactor = new MRecommendationInteractor(mockRepository);
  });

  describe('getAllRecommendations', () => {
    it('should return recommendations from the repository', async () => {
      // Arrange
      const mockRecommendations = [
        new MRecommendation('green', 1, 50, 0, 'Good air quality', 'Chất lượng không khí tốt', 'Tốt', 'Good'),
        new MRecommendation('yellow', 2, 100, 51, 'Moderate air quality', 'Chất lượng không khí trung bình', 'Trung bình', 'Moderate')
      ];
      mockRepository.getAllRecommendations = jest.fn().mockResolvedValueOnce(mockRecommendations);

      // Act
      const result = await interactor.getAllRecommendations();

      // Assert
      expect(mockRepository.getAllRecommendations).toHaveBeenCalled();
      expect(result).toEqual(mockRecommendations);
    });

    it('should handle empty recommendations', async () => {
      // Arrange
      mockRepository.getAllRecommendations = jest.fn().mockResolvedValueOnce([]);

      // Act
      const result = await interactor.getAllRecommendations();

      // Assert
      expect(result).toEqual([]);
    });

    it('should propagate repository errors', async () => {
      // Arrange
      const repositoryError = new Error('Repository error');
      mockRepository.getAllRecommendations = jest.fn().mockRejectedValueOnce(repositoryError);

      // Act & Assert
      await expect(interactor.getAllRecommendations()).rejects.toThrow(repositoryError);
    });
  });
});