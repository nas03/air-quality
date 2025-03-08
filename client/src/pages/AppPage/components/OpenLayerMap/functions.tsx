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
const fetchStationData = (map: Map, coordinates: number[], markerLayer: VectorLayer | null): MarkData | null => {
  const stationFeature = map.getFeaturesAtPixel(map.getPixelFromCoordinate(coordinates as Coordinate), {
    layerFilter: (layer) => layer instanceof VectorLayer && layer !== markerLayer,
  });

  const stationProperties = stationFeature?.at(0)?.getProperties();

  if (!stationProperties) return null;

  return {
    type: 1,
    coordinate: [stationProperties.lat, stationProperties.lng],
    aqi_index: Number(stationProperties.aqi_index),
    pm_25: stationProperties.pm25 ? Number(stationProperties.pm25) : null,
    location: stationProperties.station_name,
    time: stationProperties.timestamp,
  };
};

const fetchModelData = async (url: string, coordinate: Coordinate): Promise<MarkData | null> => {
  const modelData = await fetch(url).then(parseWMSResponse);

  if (!modelData?.features?.length) return null;

  const [aqiFeature, locationFeature] = modelData.features;
  const location = locationFeature.properties?.NAME_2
    ? `${locationFeature.properties.TYPE_2} ${locationFeature.properties.NAME_2}, ${locationFeature.properties.NAME_1}`
    : locationFeature.properties?.NAME_1;

  return {
    type: 0,
    coordinate: coordinate as [number, number],
    aqi_index: Number(aqiFeature.properties?.GRAY_INDEX),
    pm_25: Number(aqiFeature.properties?.GRAY_INDEX),
    location,
    time: modelData.timeStamp.split("T")[0].split("-").reverse().join("/"),
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
    if (configContext.layer.station && mapRef.current) {
      const stationData = fetchStationData(mapRef.current, coordinate, markerRef.current);
      if (stationData) {
        setMarkData(stationData);
        return;
      }
    }

    if (configContext.layer.model) {
      const modelData = await fetchModelData(modelURL, coordinate);
      if (modelData) {
        setMarkData(modelData);
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
