import { StationsController } from '@/domain/controllers';
import express from 'express';
import request from 'supertest';

// Mock the interactor dependency
jest.mock('@/domain/interactors/StationsInteractor', () => {
  return {
    StationsInteractor: jest.fn().mockImplementation(() => ({
      getAllStations: jest.fn(),
      getStationByID: jest.fn()
    }))
  };
});

describe('Stations API Routes', () => {
  let app: any;
  let mockController: StationsController;
  
  beforeEach(() => {
    // Create a fresh Express app for each test
    app = express();
    app.use(express.json());
    
    // Create mock controller with spied methods
    const mockInteractor = { 
      getAllStations: jest.fn(),
      getStationByID: jest.fn()
    };
    mockController = new StationsController(mockInteractor as any);
    
    // Spy on controller methods
    jest.spyOn(mockController, 'onGetAllStations');
    jest.spyOn(mockController, 'onGetStationByID');
    
    // Setup routes directly on the app to avoid TypeScript errors
    app.get('/api/stations', (req, res) => mockController.onGetAllStations(req, res));
    app.get('/api/stations/:station_id', (req, res) => mockController.onGetStationByID(req, res));
    
    // Add error handling middleware
    app.use((err: Error, req: any, res: any, next: any) => {
      res.status(500).json({ status: 'error', message: err.message });
    });
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  describe('GET /stations', () => {
    it('should return list of all stations with 200 status code', async () => {
      // Arrange
      const mockStations = [
        { id: 1, name: 'Station 1', latitude: 10.123, longitude: 106.789 },
        { id: 2, name: 'Station 2', latitude: 10.234, longitude: 106.890 }
      ];
      
      // Mock the controller to return mock data
      (mockController as any).stationsInteractor.getAllStations.mockResolvedValueOnce(mockStations);
      
      // Act
      const response = await request(app).get('/api/stations');
      
      // Assert
      expect(response.status).toBe(200);
      expect(mockController.onGetAllStations).toHaveBeenCalled();
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty('data', mockStations);
    });
    
    it('should handle empty stations array', async () => {
      // Arrange
      (mockController as any).stationsInteractor.getAllStations.mockResolvedValueOnce([]);
      
      // Act
      const response = await request(app).get('/api/stations');
      
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
      (mockController as any).stationsInteractor.getAllStations.mockRejectedValueOnce(new Error(errorMessage));
      
      // Act
      const response = await request(app).get('/api/stations');
      
      // Assert
      expect(response.status).toBe(500);
    });
  });
  
  describe('GET /stations/:station_id', () => {
    it('should return a specific station by ID with 200 status code', async () => {
      // Arrange
      const mockStation = { id: 1, name: 'Station 1', latitude: 10.123, longitude: 106.789 };
      const stationId = 1;
      
      // Mock the controller to return mock data
      (mockController as any).stationsInteractor.getStationByID.mockResolvedValueOnce(mockStation);
      
      // Act
      const response = await request(app).get(`/api/stations/${stationId}`);
      
      // Assert
      expect(response.status).toBe(200);
      expect(mockController.onGetStationByID).toHaveBeenCalled();
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty('data', mockStation);
    });
    
    it('should handle station not found case', async () => {
      // Arrange
      const stationId = 999; // Non-existent ID
      (mockController as any).stationsInteractor.getStationByID.mockResolvedValueOnce(null);
      
      // Act
      const response = await request(app).get(`/api/stations/${stationId}`);
      
      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Station not found');
    });
    
    it('should handle errors properly', async () => {
      // Arrange
      const errorMessage = 'Database error';
      const stationId = 1;
      (mockController as any).stationsInteractor.getStationByID.mockRejectedValueOnce(new Error(errorMessage));
      
      // Act
      const response = await request(app).get(`/api/stations/${stationId}`);
      
      // Assert
      expect(response.status).toBe(500);
    });
  });
});