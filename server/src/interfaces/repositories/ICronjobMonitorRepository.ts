import type { CronjobMonitor } from "@/entities";

export interface ICronjobMonitorRepository {
	getCronjobRecord(date: string): Promise<CronjobMonitor | null>;
	getAllCronjobRecords(payload?: { start_date: Date; end_date: Date }): Promise<CronjobMonitor[]>;
	createNewCronjobRecord(payload: Omit<CronjobMonitor, "id">): Promise<CronjobMonitor>;
	updateCronjobRecord(
		payload: Partial<Omit<CronjobMonitor, "id">> & { id: number },
	): Promise<CronjobMonitor>;
}
