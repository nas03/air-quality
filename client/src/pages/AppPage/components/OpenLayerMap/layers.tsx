import "@/css/open.css";
import axios from "axios";
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
        LAYERS: "air:AQI",
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
      serverType: "geoserver",
      cacheSize: 4096,
    }),
    opacity: 1,
  });

export const createStationsLayer = (time: string) =>
  new VectorLayer({
    source: new VectorSource({
      url: `http://localhost:8080/geoserver/air/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=air:stations_point_map&outputFormat=application/json&time=${time}`,
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
          // stroke: new Stroke({ color: "#fff", width: 2 }),
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
        scale: 1.3,
        crossOrigin: "anonymous",
        src: "marker.png",
      }),
      zIndex: 100000,
    }),
  });

export const createWindyLayer = async () => {
  const windData = await axios.get("https://blog.sakitam.com/wind-layer/data/wind.json");
  const data = windData.data;
  return new WindLayer(data, {
    windOptions: {
      // colorScale: scale,
      velocityScale: 1 / 150,
      paths: 5000,
      // eslint-disable-next-line no-unused-vars
      colorScale: [
        "rgb(36,104, 180)",
        "rgb(60,157, 194)",
        "rgb(128,205,193 )",
        "rgb(151,218,168 )",
        "rgb(198,231,181)",
        "rgb(238,247,217)",
        "rgb(255,238,159)",
        "rgb(252,217,125)",
        "rgb(255,182,100)",
        "rgb(252,150,75)",
        "rgb(250,112,52)",
        "rgb(245,64,32)",
        "rgb(237,45,28)",
        "rgb(220,24,32)",
        "rgb(180,0,35)",
      ],
      lineWidth: 2,
      // colorScale: scale,
      generateParticleOption: false,
    },
    fieldOptions: {
      wrapX: true,
      // flipY: true,
    },
  });
};
