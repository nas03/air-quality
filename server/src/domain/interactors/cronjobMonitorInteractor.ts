import { CronjobMonitor } from "@/entities";
import { ICronjobMonitorInteractor } from "@/interfaces";
import moment from "moment";
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

    async getAllCronjobRecords(payload?: { start_date: Date; end_date: Date }) {
        if (payload) {
            const records = await this.cronjobMonitorRepository.getAllCronjobRecords({
                start_date: moment(payload.start_date).hour(7).toDate(),
                end_date: moment(payload.end_date).add(1, "days").hour(7).toDate(),
            });
            return records;
        } else {
            const records = await this.cronjobMonitorRepository.getAllCronjobRecords();
            return records;
        }
    }
    async createNewCronjobRecord(payload: Omit<CronjobMonitor, "id">): Promise<CronjobMonitor> {
        return await this.cronjobMonitorRepository.createNewCronjobRecord(payload);
    }

    async updateCronjobRecord(
        payload: Partial<CronjobMonitor> & { id: number },
    ): Promise<CronjobMonitor> {
        const adaptedPayload = {
            ...payload,
            id: payload.id,
        };

        return await this.cronjobMonitorRepository.updateCronjobRecord(adaptedPayload);
    }
}
