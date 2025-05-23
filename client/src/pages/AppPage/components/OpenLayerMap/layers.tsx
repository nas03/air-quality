import api from "@/config/api";
import "@/css/open.css";
import dayjs from "dayjs";
import { Feature, Map } from "ol";
import { WindLayer } from "ol-wind";
import { Coordinate } from "ol/coordinate";
import { getBottomLeft } from "ol/extent";
import GeoJSON from "ol/format/GeoJSON";
import { Point } from "ol/geom";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import "ol/ol.css";
import { fromLonLat } from "ol/proj";
import { TileWMS } from "ol/source";
import VectorSource from "ol/source/Vector";
import { Circle, Fill, Icon, Stroke, Style, Text } from "ol/style";
// export const GEOSERVER_BASE_URL = "http://localhost:8080/geoserver/air";
// export const GEOSERVER_URL="http://localhost:8080/geoserver"
export const GEOSERVER_BASE_URL = "https://geoserver.nas03.xyz/geoserver/air";
export const GEOSERVER_URL = "https://geoserver.nas03.xyz/geoserver";

export const createAQILayer = (time: string) =>
    new TileLayer({
        source: new TileWMS({
            url: `${GEOSERVER_BASE_URL}/wms`,
            params: {
                LAYERS: "air:aqi_map",
                TIME: time,
                FORMAT: "image/png",
                TILED: true,
            },
            serverType: "geoserver",
            cacheSize: 4096,
        }),
        opacity: 1,
    });

export const createVietnamBoundaryLayer = (map: Map) =>
    new TileLayer({
        source: new TileWMS({
            url: `${GEOSERVER_BASE_URL}/wms`,
            params: {
                LAYERS: "air:gadm41_VNM",
                FORMAT: "image/png",
                TILED: true,
                tilesorigin: getBottomLeft(map.getView().getProjection().getExtent()).toString(),
            },
        }),
        opacity: 1,
    });

export const createStationsLayer = (time: string) => {
    const timestamp = dayjs(time).startOf("day").set("hour", 7).toISOString();
    return new VectorLayer({
        source: new VectorSource({
            url: `${GEOSERVER_BASE_URL}/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=air:stations_point_map&outputFormat=application/json&CQL_FILTER=timestamp='${timestamp}'`,
            format: new GeoJSON(),
        }),
        style: (feature) => {
            const color = feature.get("color");
            const aqiIndex = feature.get("aqi_index");

            return new Style({
                image: new Circle({
                    radius: 17.5,
                    fill: new Fill({
                        color: color || "rgba(0, 0, 255, 0.7)",
                    }),
                    stroke: new Stroke({
                        color: "#FFFFFF",
                        width: 4,
                    }),
                }),
                text: new Text({
                    text: aqiIndex,
                    font: "Bold 10px sans-serif",
                    fill: new Fill({
                        color: color === "#ffff00" ? "#333333" : "#FFFFFF",
                    }),
                    textAlign: "center",
                    textBaseline: "middle",
                }),
            });
        },
        opacity: 1,
    });
};

export const createMarkerLayer = (INITIAL_COORDINATE: Coordinate) =>
    new VectorLayer({
        source: new VectorSource({
            features: [
                new Feature({
                    geometry: new Point(fromLonLat(INITIAL_COORDINATE)),
                }),
            ],
        }),
        style: new Style({
            image: new Icon({
                anchor: [0.5, 1],
                scale: 1.4,
                crossOrigin: "anonymous",
                src: "marker.png",
            }),
            zIndex: 100000,
        }),
    });

export const createWindyLayer = async (time: string) => {
    const windData = await api.get("/wind-data", {
        params: {
            timestamp: time,
        },
    });
    const data = windData.data.data;

    return new WindLayer(data, {
        windOptions: {
            velocityScale: 1 / 700,
            paths: 800,
            colorScale: ["rgba(0, 0, 0, 0.7)"],
            lineWidth: 3.5,
            globalAlpha: 0.9,
        },
        fieldOptions: {
            flipY: true,
            wrappedX: true,
        },
    });
};

export const updateStationLayer = (stationSource: VectorSource, time: string) => {
    // const timestamp = new Date(new Date(new Date(time).getTime()).setHours(0, 0, 0, 0)).toISOString();
    const timestamp = dayjs(time).startOf("day").set("hour", 7).toISOString();
    try {
        stationSource.setUrl(
            `${GEOSERVER_BASE_URL}/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=air:stations_point_map&outputFormat=application/json&CQL_FILTER=timestamp='${timestamp}'`,
        );
        stationSource.refresh();
    } catch (error) {
        console.error("Failed to update station layer:", error);
    }
};

export const updateAQILayer = (AQISource: TileWMS, time: string) => {
    AQISource.updateParams({ TIME: time });
};

export const updateWindLayer = async (windLayer: WindLayer, time: string) => {
    if (!windLayer) return;

    try {
        const windData = await api.get("/wind-data", {
            params: { timestamp: time },
        });

        const data = windData.data.data;
        windLayer.setData(data, {
            flipY: true,
            wrappedX: true,
            
        });
    } catch (error) {
        console.error("Failed to update wind layer:", error);
    }
};
