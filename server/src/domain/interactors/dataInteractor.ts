import { StorageService } from "@/services";
import JSZip from "jszip";
import moment from "moment";
import { StationsRepository, WindDataRepository } from "../repositories";

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

        const prefixes: string[] = [];
        const currentDate = startOfMonthDate.clone();

        while (currentDate.isSameOrBefore(endOfMonthDate)) {
            prefixes.push(currentDate.format("YYYY/MM"));
            currentDate.add(1, "month");
        }

        const objectListPromises = prefixes.map((prefix) =>
            this.storageService.listObjects({ Prefix: prefix })
        );

        const objectListResults = await Promise.all(objectListPromises);

        const objectKeys: string[] = objectListResults.flatMap(
            (res) => (res.Contents || []).map((item) => item.Key).filter(Boolean) as string[]
        );

        if (objectKeys.length === 0) {
            return false;
        }

        zip = await this.storageService.getMultipleObjects(objectKeys, zip);

        return zip;
    };

    getWindDataHistory = async (start_date: string, end_date: string, zip: JSZip) => {
        const data = await this.windDataRepository.getWindDataHistory(
            moment(start_date, "YYYY-MM-DD"),
            moment(end_date, "YYYY-MM-DD")
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
            else
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
        console.log({ filename, path });
        const data = await this.storageService.getObject(path);
        return data;
    };
    getWindData = async (id: number) => {};
    getStationData = async (date: string) => {};
}
