import { StationsRepository } from "@/domain/repositories/stationsRepository";
import { Stations } from "@/entities/Stations";
import { IStationsInteractor } from "@/interfaces/interactors/IStationsInteractor";

export class StationsInteractor implements IStationsInteractor {
    private stationsRepository: StationsRepository
    constructor(stationsRepository: StationsRepository) {
        this.stationsRepository = stationsRepository
    }

    async getAllStations(date?: Date): Promise<Stations[]> {
        const data = await this.stationsRepository.getAllStations(date)
        return data
    }
    async getStationByID(station_id: string, date?: Date): Promise<Stations | null> {
        const data = await this.stationsRepository.getStationByID(station_id, date)
        return data        
    }
}