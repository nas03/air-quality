import type { WindData } from "@/entities/WindData";

export interface IWindDataRepository {
	getWindData(timestamp: Date): Promise<WindData | null>;
}
