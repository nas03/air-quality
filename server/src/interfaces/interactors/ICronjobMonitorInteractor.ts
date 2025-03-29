import { CronjobMonitor } from "@/entities";

export interface ICronjobMonitorInteractor {
  getCronjobRecord(date: string): Promise<CronjobMonitor>;
  getAllCronjobRecords(): Promise<CronjobMonitor[]>;
  createNewCronjobRecord(payload: Omit<CronjobMonitor, "id">): Promise<CronjobMonitor>;
  updateCronjobRecord(payload: Partial<CronjobMonitor> & { id: number }): Promise<CronjobMonitor>;
}
