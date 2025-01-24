import { IPropsOpenLayerMap } from "@/components/types";
import { TimeContext } from "@/context";
import "@/open.css";
import { Map, View } from "ol";
import { apply } from "ol-mapbox-style";
import { getBottomLeft } from "ol/extent";
import TileLayer from "ol/layer/Tile";
import "ol/ol.css";
import { fromLonLat } from "ol/proj";
import { TileWMS } from "ol/source";
import React, { useContext, useEffect, useRef } from "react";

const OpenLayerMap: React.FC<IPropsOpenLayerMap> = (props) => {
  const layersRef = useRef<TileLayer | null>(null);
  const { time } = useContext(TimeContext);
  const key = import.meta.env.VITE_PUBLIC_MAPTILER_KEY;
  const styleUrl = `https://api.maptiler.com/maps/7d9ee8e1-7abf-4591-ac75-85518e48ba38/style.json?key=${key}`;
  // Initialize map configuration
  const initializeMap = () => {
    return new Map({
      target: "map",
      view: new View({
        zoom: 8,
        constrainResolution: true,
        projection: "EPSG:3857",
        center: fromLonLat([105.97, 17.9459]),
      }),
      controls: [],
    });
  };

  // Create WMS layers
  const createLayers = (map: Map) => {
    const layers = [createAQILayer(), createVietnamBoundaryLayer(map), createStationsLayer()];
    layersRef.current = layers[0];
    return layers;
  };

  const createAQILayer = () =>
    new TileLayer({
      source: new TileWMS({
        url: "http://localhost:8080/geoserver/air/wms",
        params: {
          LAYERS: "air:AQI",
          TIME: time,
          FORMAT: "image/png",
        },
        serverType: "geoserver",
        cacheSize: 4096,
      }),
      opacity: 1,
    });

  const createVietnamBoundaryLayer = (map: Map) =>
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

  const createStationsLayer = () =>
    new TileLayer({
      source: new TileWMS({
        url: "http://localhost:8080/geoserver/air/wms",
        params: {
          LAYERS: "air:stations_point_map",
          TILED: true,
        },
        serverType: "geoserver",
        cacheSize: 4096,
        crossOrigin: "anonymous",
      }),
      opacity: 1,
    });

  // Handle map click events
  const handleMapClick = (map: Map, layers: TileLayer[]) => {
    map.on("singleclick", function (evt) {
      const viewResolution = map.getView().getResolution();
      const wmsSource = layers[0].getSource() as TileWMS;
      const url = wmsSource?.getFeatureInfoUrl(evt.coordinate, Number(viewResolution), "EPSG:3857", {
        INFO_FORMAT: "text/javascript",
        LAYERS: "air:AQI,air:gadm41_VNM_2,air:gadm41_VNM_1,air:gadm41_VNM_3",
        QUERY_LAYERS: "air:AQI,air:gadm41_VNM_2,air:gadm41_VNM_1,air:gadm41_VNM_3",
        SRS: "EPSG:3857",
        FEATURE_COUNT: 4,
      });

      if (url) {
        fetchLocationData(url, evt.coordinate, props.setMarkData);
      }
    });
  };

  const fetchLocationData = async (url: string, coordinate: number[], setMarkData: Function) => {
    try {
      const response = await fetch(url);
      const text = await response.text();
      const jsonStr = text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1);
      const data = JSON.parse(jsonStr);

      if (data.features && data.features.length > 0) {
        const markLocation = data.features[1].properties;
        const aqi_index = data.features[0].properties.GRAY_INDEX;

        setMarkData({
          coordinate: [Number(coordinate[0]), Number(coordinate[1])],
          value: Number(aqi_index),
          location: `${[markLocation.TYPE_2, markLocation.NAME_2].join(" ")}, ${markLocation.NAME_1}`,
          time: data.timeStamp.split("T")[0].split("-").reverse().join("/"),
        });
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  useEffect(() => {
    const map = initializeMap();
    const layers = createLayers(map);

    Promise.resolve(
      apply(map, styleUrl).then(() => {
        map.getLayers().extend(layers);
      }),
    );

    handleMapClick(map, layers);

    return () => {
      map.dispose();
    };
  }, []);

  useEffect(() => {
    if (layersRef.current) {
      (layersRef.current.getSource() as TileWMS).updateParams({
        TIME: time,
      });
    }
  }, [time]);

  return (
    <>
      <div id="map" className="absolute bottom-0 top-0 h-full w-full" />
    </>
  );
};

export default OpenLayerMap;
