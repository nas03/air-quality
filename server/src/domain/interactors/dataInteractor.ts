import { StorageService } from "@/services";
import type JSZip from "jszip";
import moment from "moment";
import type { StationsRepository, WindDataRepository } from "../repositories";

export class DataInteractor {
	private readonly storageService: StorageService;
	private readonly windDataRepository: WindDataRepository;
	private readonly stationRepository: StationsRepository;

	constructor(windDataRepository: WindDataRepository, stationRepository: StationsRepository) {
		this.storageService = new StorageService();
		this.windDataRepository = windDataRepository;
		this.stationRepository = stationRepository;
	}

	getRasterDataHistory = async (start_date: string, end_date: string, zip: JSZip) => {
		const startOfMonthDate = moment(start_date, "YYYY-MM-DD").startOf("M");
		const endOfMonthDate = moment(end_date, "YYYY-MM-DD").endOf("M");
		const startDate = moment(start_date, "YYYY-MM-DD");
		const endDate = moment(end_date, "YYYY-MM-DD");

		const prefixes: string[] = [];
		const currentDate = startOfMonthDate.clone();

		while (currentDate.isSameOrBefore(endOfMonthDate)) {
			prefixes.push(currentDate.format("YYYY/MM"));
			currentDate.add(1, "month");
		}
		const objectKeys: string[] = [];
		await Promise.all(
			prefixes.map((prefix, index) =>
				this.storageService.listObjects({ Prefix: prefix }).then((res) => {
					let keys: string[] = [];
					if (index === 0 || index === prefixes.length - 1) {
						keys = (res.Contents || [])
							.map((item) => item.Key)
							.filter((key): key is string => {
								if (!key) return false;

								const [, , filename] = key.split("/");
								if (!filename) return false;

								const filenameParts = filename.split("_");
								if (filenameParts.length < 2) return false;

								const filenameDate = filenameParts[1];
								if (filenameDate.length < 8) return false;

								const timestamp = [
									filenameDate.slice(0, 4),
									filenameDate.slice(4, 6),
									filenameDate.slice(6, 8),
								].join("-");
								const fileDate = moment(timestamp, "YYYY-MM-DD");

								return (
									fileDate.isSameOrAfter(startDate) &&
									fileDate.isSameOrBefore(endDate)
								);
							});
					} else {
						keys = (res.Contents || [])
							.map((item) => item.Key)
							.filter((key): key is string => Boolean(key));
					}
					objectKeys.push(...keys);
				}),
			),
		);

		if (objectKeys.length === 0) {
			return false;
		}

		const newZip = await this.storageService.getMultipleObjects(objectKeys, zip);

		return newZip;
	};

	getWindDataHistory = async (start_date: string, end_date: string, zip: JSZip) => {
		const data = await this.windDataRepository.getWindDataHistory(
			moment(start_date, "YYYY-MM-DD"),
			moment(end_date, "YYYY-MM-DD"),
		);
		const dataBuffer = Buffer.from(JSON.stringify(data));
		return zip.file("wind_data.json", dataBuffer);
	};

	getStationDataHistory = async (start_date: string, end_date: string, zip: JSZip) => {
		const startDate = moment(start_date, "YYYY-MM-DD");
		const endDate = moment(end_date, "YYYY-MM-DD");
		const data = await this.stationRepository.getStationDataHistory(startDate, endDate);
		const dataMap = new Map<
			string,
			{
				station_id: string;
				station_name: string | null;
				address: string | null;
				data: {
					id: number;
					status: string;
					aqi: number;
					pm25: number | null;
					timestamp: Date;
				}[];
			}
		>();
		data.reduce((map, data) => {
			const item = map.get(data.station_id);
			if (!item)
				return map.set(data.station_id, {
					station_id: data.station_id,
					station_name: data.station_name,
					address: data.address,
					data: [
						{
							id: data.id,
							status: data.status,
							aqi: data.aqi_index,
							pm25: data.pm25,
							timestamp: data.timestamp,
						},
					],
				});

			return map.set(data.station_id, {
				...item,
				data: [
					...item.data,
					{
						id: data.id,
						status: data.status,
						aqi: data.aqi_index,
						pm25: data.pm25,
						timestamp: data.timestamp,
					},
				],
			});
		}, dataMap);
		const jsonData = Buffer.from(JSON.stringify(Object.fromEntries(dataMap)));
		zip.file("stations.json", jsonData);
		return zip;
	};

	getRasterData = async (date: string) => {
		const prefix = date.split("-").splice(0, 2).join("/");
		const filename = ["AQI", date.split("-").join("").toString(), "3kmNRT.tif"].join("_");
		const path = `${prefix}/${filename}`;

		const data = await this.storageService.getObject(path);
		return data;
	};
}
