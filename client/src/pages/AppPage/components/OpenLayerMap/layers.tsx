import api from "@/config/api";
import "@/css/open.css";
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

export const createAQILayer = (time: string) =>
  new TileLayer({
    source: new TileWMS({
      url: "http://localhost:8080/geoserver/air/wms",
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
      url: "http://localhost:8080/geoserver/air/wms",
      params: {
        LAYERS: "air:gadm41_VNM",
        FORMAT: "image/png",
        TILED: true,
        tilesorigin: getBottomLeft(map.getView().getProjection().getExtent()).toString(),
      },
    }),
    opacity: 1,
  });

export const createStationsLayer = (time: string) =>
  new VectorLayer({
    source: new VectorSource({
      url: `http://localhost:8080/geoserver/air/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=air:stations_point_map&outputFormat=application/json&CQL_FILTER=timestamp='${time}'`,
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

export const createWindyLayer = async () => {
  const windData = await api.get("/wind-data?timestamp=2025-03-17T07:00:00");
  const data = windData.data.data;

  return new WindLayer(data, {
    windOptions: {
      velocityScale: 1 / 700,
      paths: 2000,
      colorScale: ["rgba(255, 255, 255, 0.7)"],
      lineWidth: 2,
      globalAlpha: 0.8,
    },
    fieldOptions: {
      flipY: true,
      wrappedX: true,
    },
  });
};
