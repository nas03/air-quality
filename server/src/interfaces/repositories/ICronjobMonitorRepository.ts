import { CronjobMonitor } from "@/entities";

export interface ICronjobMonitorRepository {
  getCronjobRecord(date: Date): Promise<CronjobMonitor | null>;
  createNewCronjobRecord(payload: Omit<CronjobMonitor, "id">): Promise<CronjobMonitor>;
  updateCronjobRecord(
    payload: Partial<Omit<CronjobMonitor, "id">> & { id: number }
  ): Promise<CronjobMonitor>;
}
