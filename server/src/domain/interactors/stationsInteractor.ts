import { StationsRepository } from "@/domain/repositories";
import { Station } from "@/entities";
import { IStationsInteractor } from "@/interfaces";

export class StationsInteractor implements IStationsInteractor {
  private stationsRepository: StationsRepository;
  constructor(stationsRepository: StationsRepository) {
    this.stationsRepository = stationsRepository;
  }

  async getAllStations(date?: Date): Promise<Station[]> {
    const data = await this.stationsRepository.getAllStations(date);
    return data;
  }
  async getStationByID(station_id: string, date?: Date): Promise<Station | null> {
    const data = await this.stationsRepository.getStationByID(station_id, date);
    return data;
  }
}
