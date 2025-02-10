import { IPropsOpenLayerMap } from "@/components/types";
import { ConfigContext, TimeContext } from "@/context";
import "@/css/open.css";
import { Feature, Map, View } from "ol";
import { apply } from "ol-mapbox-style";
import { defaults as defaultControls } from "ol/control/defaults.js";
import { Coordinate } from "ol/coordinate";
import { getBottomLeft } from "ol/extent";
import { FeatureObject } from "ol/format/Feature";
import { Point } from "ol/geom";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import "ol/ol.css";
import { fromLonLat } from "ol/proj";
import { TileWMS } from "ol/source";
import VectorSource from "ol/source/Vector";
import { Icon, Style } from "ol/style";
import React, { useContext, useEffect, useRef } from "react";
const OpenLayerMap: React.FC<IPropsOpenLayerMap> = (props) => {
  const layersRef = useRef<TileLayer | null>(null);
  const markerRef = useRef<VectorLayer | null>(null);
  const mapRef = useRef<Map | null>(null);
  const { time } = useContext(TimeContext);
  const key = import.meta.env.VITE_PUBLIC_MAPTILER_KEY;
  const configContext = useContext(ConfigContext);

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
      controls: defaultControls({
        zoomOptions: {
          className: "top-[5rem] right-3 rounded-full w-fit h-fit bg-white ",
          zoomInClassName: "!rounded-full !w-fit !h-fit !py-4 !px-3 hover:bg-blue-100 !outline-blue-400",
          zoomOutClassName: "!rounded-full !w-fit !h-fit !py-4 !px-3 hover:bg-blue-100 !outline-blue-400",
        },
      }),
    });
  };

  // Create WMS layers
  const createLayers = (map: Map) => {
    const layers = [createAQILayer(), createVietnamBoundaryLayer(map), createStationsLayer(), createMarkerLayer()];
    layersRef.current = layers[0] as TileLayer;
    markerRef.current = layers[3] as VectorLayer;
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

  const createMarkerLayer = () =>
    new VectorLayer({
      source: new VectorSource({
        features: [
          new Feature({
            geometry: new Point(fromLonLat([105.852, 21.229])),
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

  const handleMarkerChange = (coordinate: Coordinate) => {
    const markerFeature = markerRef.current?.getSource()?.getFeatures().at(0);
    if (markerFeature) {
      markerFeature.setGeometry(new Point(coordinate));
    }
  };
  const handleUpdateLocationData = (map: Map, layers: (TileLayer | VectorLayer)[], coordinate: Coordinate) => {
    const viewResolution = map.getView().getResolution();
    const wmsSource = layers[0].getSource() as TileWMS;
    const url = wmsSource?.getFeatureInfoUrl(coordinate, Number(viewResolution), "EPSG:3857", {
      INFO_FORMAT: "text/javascript",
      LAYERS: "air:AQI,air:gadm41_VNM_2,air:gadm41_VNM_1,air:gadm41_VNM_3,air:stations_point_map",
      QUERY_LAYERS: "air:AQI,air:gadm41_VNM_2,air:gadm41_VNM_1,air:gadm41_VNM_3,air:stations_point_map",
      SRS: "EPSG:3857",
      FEATURE_COUNT: 50,
    });

    if (url) {
      fetchLocationData(url, coordinate, props.setMarkData);
    }
  };
  const handleMapClick = (map: Map, layers: (TileLayer | VectorLayer)[]) => {
    map.on("singleclick", function (evt) {
      handleMarkerChange(evt.coordinate);
      handleUpdateLocationData(map, layers, evt.coordinate);
    });
  };

  const fetchLocationData = async (url: string, coordinate: number[], setMarkData: Function) => {
    try {
      const response = await fetch(url);
      const text = await response.text();
      const jsonStr = text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1);
      const data = JSON.parse(jsonStr);

      if (!data.features?.length) return;

      const processStationData = (features: FeatureObject[]) => {
        const stationFeature = features.find((feature) => String(feature.id).includes("stations_point_map"));

        if (!stationFeature?.properties) return null;
        console.log([stationFeature.properties?.lat, stationFeature.properties?.lng]);
        return {
          type: 1,
          coordinate: [stationFeature.properties?.lat, stationFeature.properties?.lng],
          value: Number(stationFeature.properties.aqi_index),
          location: stationFeature.properties.station_name,
          time: stationFeature.properties.timestamp,
        };
      };

      const processModelData = (features: FeatureObject[]) => {
        const [aqiFeature, locationFeature] = features;

        return {
          type: 0,
          coordinate: coordinate.map(Number),
          value: Number(aqiFeature.properties?.GRAY_INDEX),
          location: locationFeature.properties?.NAME_2
            ? `${[locationFeature.properties?.TYPE_2, locationFeature.properties?.NAME_2].join(" ")}, ${locationFeature.properties?.NAME_1}`
            : locationFeature.properties?.NAME_1,
          time: data.timeStamp.split("T")[0].split("-").reverse().join("/"),
        };
      };

      if (configContext.layer.station) {
        const stationData = processStationData(data.features);
        if (stationData) {
          setMarkData(stationData);
          return;
        }
      }

      if (configContext.layer.model) {
        setMarkData(processModelData(data.features));
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  // Initialize map and layers
  useEffect(() => {
    const map = initializeMap();
    const layers = createLayers(map);

    const setupMap = async () => {
      await apply(map, styleUrl);
      map.getLayers().extend(layers);
      handleMapClick(map, layers);
    };

    setupMap();
    mapRef.current = map;

    return () => map.dispose();
  }, []);

  // Update time parameter for AQI WMS Request
  useEffect(() => {
    const source = layersRef.current?.getSource() as TileWMS;
    source?.updateParams({ TIME: time });
  }, [time]);

  // Handle layer visibility changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const [, , aqiLayer, boundaryLayer, stationsLayer] = map.getLayers().getArray();

    const updateLayerVisibility = (layer: any, isVisible: boolean) => {
      layer?.setVisible(isVisible);
    };

    updateLayerVisibility(aqiLayer, configContext.layer.model);
    updateLayerVisibility(boundaryLayer, configContext.layer.model);
    updateLayerVisibility(stationsLayer, configContext.layer.station);
  }, [configContext.layer]);

  return (
    <>
      <div id="map" className="absolute bottom-0 top-0 h-full w-full" />
    </>
  );
};

export default OpenLayerMap;
