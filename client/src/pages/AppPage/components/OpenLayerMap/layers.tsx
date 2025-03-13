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
        scale: 1.4,
        crossOrigin: "anonymous",
        src: "marker.png",
      }),
      zIndex: 100000,
    }),
  });

export const createWindyLayer = async () => {
  const windData = await axios.get("/gfs.json");
  const data = windData.data;
  // Fetch wind data from local JSON file
  /*  const response = await fetch("/gfs.json");
  const data = await response.json(); */
  return new WindLayer(data, {
    windOptions: {
      // colorScale: scale,
      velocityScale: 1 / 500,
      paths: 2000,
      // eslint-disable-next-line no-unused-vars
      colorScale: [
        "rgb(0, 0, 75)", // Deep blue (slow)
        "rgb(0, 0, 130)",
        "rgb(0, 50, 170)",
        "rgb(0, 90, 200)",
        "rgb(0, 130, 230)", // Light blue
        "rgb(0, 170, 255)",
        "rgb(80, 180, 250)",
        "rgb(130, 210, 255)",
        "rgb(160, 240, 255)", // Cyan
        "rgb(200, 255, 170)", // Light green
        "rgb(255, 255, 0)", // Yellow
        "rgb(255, 200, 0)", // Orange
        "rgb(255, 150, 0)",
        "rgb(255, 80, 0)", // Reddish orange
        "rgb(230, 0, 0)", // Red (fast)
      ],
      lineWidth: 2,
      // colorScale: scale,
      generateParticleOption: false,
    },
    fieldOptions: {
      flipY: true,
      wrappedX: true,
      /* xmin: 101.8,
      xmax: 110.3,
      ymin: 8,
      ymax: 24, */
      //   deltaX:0.25,
      // deltaY:0.25,
    },
  });
};
