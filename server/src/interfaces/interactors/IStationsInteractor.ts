import { Stations } from "@/entities/Stations";

export interface IStationsInteractor {
    getStationByID(station_id: string, date?: Date): Promise<Stations | null>
    getAllStations(date?: Date): Promise<Stations[]>
}