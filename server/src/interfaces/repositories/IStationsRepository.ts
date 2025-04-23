import type { Station } from "@/entities/Station";

export interface IStationsRepository {
	getStationByID(station_id: string, date?: Date): Promise<Station | null>;
	getAllStations(date?: Date): Promise<Station[]>;
}
