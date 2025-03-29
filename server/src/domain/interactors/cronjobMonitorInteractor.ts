import { CronjobMonitor } from "@/entities";
import { ICronjobMonitorInteractor } from "@/interfaces";
import { CronjobMonitorRepository } from "../repositories";

export class CronjobMonitorInteractor implements ICronjobMonitorInteractor {
  private readonly cronjobMonitorRepository: CronjobMonitorRepository;

  constructor(cronjobMonitorRepository: CronjobMonitorRepository) {
    this.cronjobMonitorRepository = cronjobMonitorRepository;
  }

  async getCronjobRecord(date: string): Promise<CronjobMonitor> {
    const record = await this.cronjobMonitorRepository.getCronjobRecord(date);
    if (!record) {
      throw new Error(`Cronjob record for date ${date} not found`);
    }
    return record;
  }

  async getAllCronjobRecords() {
    const records = await this.cronjobMonitorRepository.getAllCronjobRecords();
    return records;
  }
  async createNewCronjobRecord(payload: Omit<CronjobMonitor, "id">): Promise<CronjobMonitor> {
    return await this.cronjobMonitorRepository.createNewCronjobRecord(payload);
  }

  async updateCronjobRecord(
    payload: Partial<CronjobMonitor> & { id: number }
  ): Promise<CronjobMonitor> {
    const adaptedPayload = {
      ...payload,
      id: payload.id,
    };

    return await this.cronjobMonitorRepository.updateCronjobRecord(adaptedPayload);
  }
}

