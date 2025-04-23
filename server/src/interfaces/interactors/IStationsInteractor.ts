import type { Station } from "@/entities/Station";

export interface IStationsInteractor {
	getStationByID(station_id: string, date?: Date): Promise<Station | null>;
	getAllStations(date?: Date): Promise<Station[]>;
}
