import { CronjobMonitor } from "@/entities";

export interface ICronjobMonitorRepository {
    getCronjobRecord(date: string): Promise<CronjobMonitor | null>;
    getAllCronjobRecords(): Promise<CronjobMonitor[]>;
    createNewCronjobRecord(payload: Omit<CronjobMonitor, "id">): Promise<CronjobMonitor>;
    updateCronjobRecord(
        payload: Partial<Omit<CronjobMonitor, "id">> & { id: number },
    ): Promise<CronjobMonitor>;
}
