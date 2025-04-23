import type { WindData } from "@/entities/WindData";
import type { IWindDataInteractor, WindDataType } from "@/interfaces";
import type { WindDataRepository } from "../repositories";

export class WindDataInteractor implements IWindDataInteractor {
	private readonly windDataRepository: WindDataRepository;
	constructor(windDataRepository: WindDataRepository) {
		this.windDataRepository = windDataRepository;
	}
	private constructHeader = (data: WindData): [WindDataType, WindDataType] => {
		const commonHeader = {
			parameterUnit: "m.s-1",
			gridUnits: "degrees",
			resolution: 48,
			winds: "true",
			scanMode: 64,
			nx: 34,
			ny: 65,
			basicAngle: 0,
			lo1: 102.0,
			la1: 8.0,
			lo2: 110.25,
			la2: 24.0,
			dx: 0.25,
			dy: 0.25,
		};
		const ugrid: WindDataType = {
			header: {
				...commonHeader,
				parameterCategory: 2,
				parameterCategoryName: "Momentum",
				parameterNumber: 2,
				parameterNumberName: "UGRD",
			},
			data: data.ugrid_data,
		};
		const vgrid: WindDataType = {
			header: {
				...commonHeader,
				parameterCategory: 2,
				parameterCategoryName: "Momentum",
				parameterNumber: 3,
				parameterNumberName: "VGRD",
			},
			data: data.vgrid_data,
		};
		return [ugrid, vgrid];
	};
	async getWindData(timestamp: Date): Promise<[WindDataType, WindDataType] | null> {
		const windData = await this.windDataRepository.getWindData(timestamp);
		if (!windData)
			return this.constructHeader({
				ugrid_data: [],
				vgrid_data: [],
				id: -1,
				timestamp: timestamp,
			});
		return this.constructHeader(windData);
	}
}
