import { DistrictsData } from "@/api";
import { aqiThresholds, colorMap, MonitoringData, pm25Thresholds } from "@/types/consts";
import { MonitoringOutputDataType } from "@/types/types";
import GeoJSON from "ol/format/GeoJSON";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Fill, Stroke, Style, Text } from "ol/style";

export const createProvinceBoundaryLayer = (
    mapData: any,
    provinceData: DistrictsData[],
    dataType: MonitoringOutputDataType,
) => {
    const format = new GeoJSON();
    const features = format.readFeatures(mapData);

    const getDataByDistrict = (district_id: string) => {
        const district = provinceData?.find((d: any) => d.district_id == district_id);
        if (!district) return district_id;
        let dataString: string = "";
        if (dataType === MonitoringData.OUTPUT.AQI) {
            dataString = Math.ceil(Number(district.aqi_index)).toString();
        } else if (dataType === MonitoringData.OUTPUT.PM25) {
            dataString = district.pm_25.toFixed(2);
        }
        return `${district.vn_district}: ${dataString}`;
    };

    const getColorByData = (district_id: string) => {
        const data = provinceData?.find((d) => d.district_id === district_id);
        let thresholds: number[] = [];
        let value: number = 0;
        if (dataType === MonitoringData.OUTPUT.AQI) {
            thresholds = aqiThresholds;
            value = Math.ceil(Number(data?.aqi_index));
        } else {
            thresholds = pm25Thresholds;
            value = Number(data?.pm_25.toFixed(2));
        }

        if (value <= thresholds[0]) return colorMap[0];
        else if (value <= thresholds[1]) return colorMap[1];
        else if (value <= thresholds[2]) return colorMap[2];
        else if (value <= thresholds[3]) return colorMap[3];
        else if (value <= thresholds[4]) return colorMap[4];
        else return colorMap[5];
    };

    return new VectorLayer({
        source: new VectorSource({ features }),
        style: (feature) =>
            new Style({
                text: new Text({
                    text: getDataByDistrict(feature.get("GID_2")),
                    fill: new Fill({ color: "#000" }),
                    scale: 1.2,
                    stroke: new Stroke({ color: "#fff", width: 2 }),
                }),
                fill: new Fill({ color: getColorByData(feature.get("GID_2")) }),
                stroke: new Stroke({ color: "#3399CC", width: 1 }),
            }),
    });
};
