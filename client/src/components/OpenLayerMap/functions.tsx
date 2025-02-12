import { parseWMSResponse } from "@/components/OpenLayerMap/utils";
import "@/css/open.css";
import { MarkData } from "@/types";
import { ConfigContextType } from "@/types/contexts";
import { Map } from "ol";
import { Coordinate } from "ol/coordinate";
import { FeatureObject } from "ol/format/Feature";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import "ol/ol.css";
import { TileWMS } from "ol/source";
import React from "react";

export const fetchLocationData = async (
  stationURL: string,
  modelURL: string,
  coordinate: number[],
  setMarkData: React.Dispatch<React.SetStateAction<MarkData>>,
  configContext: ConfigContextType,
) => {
  const createStationData = (feature: FeatureObject): Omit<MarkData, "recommendation"> => ({
    type: 1,
    coordinate: [feature.properties?.lat, feature.properties?.lng],
    aqi_index: Number(feature.properties?.aqi_index),
    pm_25: feature.properties?.pm25 ? Number(feature.properties.pm25) : null,
    location: feature.properties?.station_name,
    time: feature.properties?.timestamp,
  });

  const createModelData = (features: FeatureObject[], timestamp: string): Omit<MarkData, "recommendation"> => {
    const [aqiFeature, locationFeature] = features;
    const location = locationFeature.properties?.NAME_2
      ? `${locationFeature.properties.TYPE_2} ${locationFeature.properties.NAME_2}, ${locationFeature.properties.NAME_1}`
      : locationFeature.properties?.NAME_1;

    return {
      type: 0,
      coordinate: coordinate as [number, number],
      aqi_index: Number(aqiFeature.properties?.GRAY_INDEX),
      pm_25: Number(aqiFeature.properties?.GRAY_INDEX),
      location,
      time: timestamp.split("T")[0].split("-").reverse().join("/"),
    };
  };

  try {
    const [modelData, stationData] = await Promise.all([
      fetch(modelURL).then(parseWMSResponse),
      fetch(stationURL).then(parseWMSResponse),
    ]);

    if (configContext.layer.station && stationData?.features?.length) {
      const stationFeature = (stationData.features as FeatureObject[]).find((f) =>
        String(f.id).includes("stations_point_map"),
      );
      if (stationFeature?.properties) {
        setMarkData(createStationData(stationFeature));
        return;
      }
    }

    if (configContext.layer.model && modelData?.features?.length) {
      setMarkData(createModelData(modelData.features, modelData.timeStamp));
    }
  } catch (error) {
    console.error("Failed to fetch location data:", error);
  }
};

export const getWMSFeatureInfo = (
  map: Map,
  mapLayers: (TileLayer | VectorLayer)[],
  layers: string[],
  queryLayers: string[],
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
    QUERY_LAYERS: queryLayers.join(","),
    ...(time && { TIME: time }),
  });
};
