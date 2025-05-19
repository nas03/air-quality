import "@/css/open.css";
import { ConfigContextType } from "@/types/contexts";
import { MarkData } from "@/types/types";
import { Map } from "ol";
import { WindLayer } from "ol-wind";
import { Coordinate } from "ol/coordinate";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import "ol/ol.css";
import { TileWMS } from "ol/source";
import React from "react";
import { parseWMSResponse } from "./utils";

interface AQIRange {
    aqiLow: number;
    aqiHigh: number;
    pm25Low: number;
    pm25High: number;
}

const AQI_RANGES: AQIRange[] = [
    { aqiLow: 0, aqiHigh: 50, pm25Low: 0.0, pm25High: 12.0 },
    { aqiLow: 51, aqiHigh: 100, pm25Low: 12.1, pm25High: 35.4 },
    { aqiLow: 101, aqiHigh: 150, pm25Low: 35.5, pm25High: 55.4 },
    { aqiLow: 151, aqiHigh: 200, pm25Low: 55.5, pm25High: 150.4 },
    { aqiLow: 201, aqiHigh: 300, pm25Low: 150.5, pm25High: 250.4 },
    { aqiLow: 301, aqiHigh: 400, pm25Low: 250.5, pm25High: 350.4 },
    { aqiLow: 401, aqiHigh: 500, pm25Low: 350.5, pm25High: 500.4 },
];

const lerp = (ylo: number, yhi: number, xlo: number, xhi: number, x: number): number => {
    return ((x - xlo) / (xhi - xlo)) * (yhi - ylo) + ylo;
};

const aqi_pm25 = (aqi: number): number => {
    if (aqi <= 0) return 0;
    if (aqi > 500) return 500;

    const range = AQI_RANGES.find((range) => aqi >= range.aqiLow && aqi <= range.aqiHigh);

    if (!range) return 500;

    const pm25 = lerp(range.pm25Low, range.pm25High, range.aqiLow, range.aqiHigh, aqi);

    return Math.floor(pm25 * 10) / 10;
};

const fetchStationData = (map: Map, coordinates: number[], markerLayer: VectorLayer | null): MarkData | null => {
    const stationFeature = map.getFeaturesAtPixel(map.getPixelFromCoordinate(coordinates as Coordinate), {
        layerFilter: (layer) => layer instanceof VectorLayer && layer !== markerLayer,
    });

    const stationProperties = stationFeature?.at(0)?.getProperties();

    if (!stationProperties) return null;

    return {
        type: 1,
        coordinate: [stationProperties.lng, stationProperties.lat],
        aqi_index: Number(stationProperties.aqi_index),
        pm_25: stationProperties.pm25 ? Number(stationProperties.pm25) : null,
        location: stationProperties.station_name,
        time: stationProperties.timestamp,
        wind_speed: 0,
        district_id: "",
    };
};

const fetchWindData = (map: Map, coordinate: number[]) => {
    const windFeature = map
        .getLayers()
        .getArray()
        .find((layer) => layer instanceof WindLayer);
    const value = windFeature?.getData()?.valueAt(coordinate[0], coordinate[1])?.magnitude();
    return value ?? null;
};

const fetchModelData = async (url: string, coordinate: Coordinate): Promise<MarkData | null> => {
    const modelData = await fetch(url).then(parseWMSResponse);

    if (!modelData?.features?.length) return null;

    const [aqiFeature, locationFeature] = modelData.features;

    const locationProps = locationFeature.properties || "";
    let location = "";

    if (locationProps) {
        location = locationProps?.NAME_2
            ? locationProps?.TYPE_3
                ? `${locationProps.TYPE_3} ${locationProps.NAME_3}, ${locationProps.NAME_2}, ${locationProps.NAME_1}`
                : `${locationProps.TYPE_2} ${locationProps.NAME_2}, ${locationProps.NAME_1}`
            : locationProps?.NAME_1;
    }

    return {
        type: 0,
        coordinate: coordinate as [number, number],
        aqi_index: Number(aqiFeature.properties?.GRAY_INDEX),
        pm_25: aqi_pm25(Number(aqiFeature.properties?.GRAY_INDEX)),
        location,
        time: "",
        wind_speed: 0,
        district_id: locationProps.GID_2 || "",
    };
};
export const fetchLocationData = async (
    modelURL: string,
    coordinate: number[],
    setMarkData: React.Dispatch<React.SetStateAction<MarkData>>,
    configContext: ConfigContextType,
    mapRef: React.RefObject<Map>,
    markerRef: React.RefObject<VectorLayer>,
) => {
    try {
        let wind_speed: number | null = null;
        if (mapRef.current) {
            wind_speed = fetchWindData(mapRef.current, coordinate);
        }

        if (configContext.layer.station && mapRef.current) {
            const stationData = fetchStationData(mapRef.current, coordinate, markerRef.current);

            if (stationData) {
                setMarkData({ ...stationData, wind_speed: wind_speed ?? 0 });
                return;
            }
        }

        if (configContext.layer.model) {
            const modelData = await fetchModelData(modelURL, coordinate);
            if (modelData) {
                setMarkData({ ...modelData, wind_speed: wind_speed ?? 0 });
            }
        }
    } catch (error) {
        console.error("Failed to fetch location data:", error);
    }
};

export const getWMSFeatureInfo = (
    map: Map,
    mapLayers: (TileLayer | VectorLayer | WindLayer)[],
    layers: string[],
    coordinate: Coordinate,
    time?: string,
) => {
    const viewResolution = map.getView().getResolution();
    const wmsSource = mapLayers[0].getSource() as TileWMS;

    /* const baseParams = {
    INFO_FORMAT: "text/javascript",
    SRS: "EPSG:3857",
    FEATURE_COUNT: 50,
  }; */
    return wmsSource?.getFeatureInfoUrl(coordinate, Number(viewResolution), "EPSG:3857", {
        INFO_FORMAT: "text/javascript",
        SRS: "EPSG:3857",
        FEATURE_COUNT: 50,
        LAYERS: layers.join(","),
        QUERY_LAYERS: layers.join(","),
        ...(time && { TIME: time }),
    });
};
