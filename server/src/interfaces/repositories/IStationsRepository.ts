import { Stations } from "@/entities/Stations";

export interface IStationsRepository {
    getStationByID(station_id: string, date?: Date): Promise<Stations | null>
    getAllStations(date?: Date):Promise<Stations[]>
}