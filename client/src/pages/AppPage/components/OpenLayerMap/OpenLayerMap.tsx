import { IPropsOpenLayerMap } from "@/components/types";
import { ConfigContext, TimeContext } from "@/context";
import "@/css/open.css";
import { Map, View } from "ol";
import { apply } from "ol-mapbox-style";
import { defaults as defaultControls } from "ol/control/defaults.js";
import { Coordinate } from "ol/coordinate";
import { Point } from "ol/geom";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import "ol/ol.css";
import { fromLonLat } from "ol/proj";
import { TileWMS } from "ol/source";
import React, { useContext, useEffect, useRef } from "react";
import { fetchLocationData, getWMSFeatureInfo } from "./functions";
import { createAQILayer, createMarkerLayer, createStationsLayer, createVietnamBoundaryLayer } from "./layers";

const OpenLayerMap: React.FC<IPropsOpenLayerMap> = (props) => {
  const layersRef = useRef<TileLayer | null>(null);
  const markerRef = useRef<VectorLayer | null>(null);
  const mapRef = useRef<Map | null>(null);
  const { time } = useContext(TimeContext);
  const configContext = useContext(ConfigContext);

  const key = import.meta.env.VITE_PUBLIC_MAPTILER_KEY;
  const styleUrl = `https://api.maptiler.com/maps/7d9ee8e1-7abf-4591-ac75-85518e48ba38/style.json?key=${key}`;
  const INITIAL_COORDINATE = [105.871, 21];

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

  const createLayers = (map: Map) => {
    const layers = [
      createAQILayer(time),
      createVietnamBoundaryLayer(map),
      createStationsLayer(),
      createMarkerLayer(INITIAL_COORDINATE),
    ];
    layersRef.current = layers[0] as TileLayer;
    markerRef.current = layers[3] as VectorLayer;
    return layers;
  };

  const handleMarkerChange = (coordinate: Coordinate) => {
    const markerFeature = markerRef.current?.getSource()?.getFeatures().at(0);
    if (markerFeature) {
      markerFeature.setGeometry(new Point(coordinate));
    }
  };

  const handleUpdateLocationData = (map: Map, mapLayers: (TileLayer | VectorLayer)[], coordinate: Coordinate) => {
    const modelLayers = ["air:AQI", "air:gadm41_VNM_2", "air:gadm41_VNM_1", "air:gadm41_VNM_3"];
    const stationLayers = ["air:stations_point_map"];

    const modelURL = getWMSFeatureInfo(map, mapLayers, modelLayers, modelLayers, coordinate);
    const stationURL = getWMSFeatureInfo(
      map,
      mapLayers,
      stationLayers,
      stationLayers,
      coordinate,
      "2025-02-13T19:00:00Z",
    );

    if (!modelURL || !stationURL) {
      console.error("Failed to generate WMS URLs for location data");
      return;
    }

    fetchLocationData(stationURL, modelURL, coordinate, props.setMarkData, configContext);
  };

  const handleMapClick = (map: Map, layers: (TileLayer | VectorLayer)[]) => {
    map.on("singleclick", function (evt) {
      handleMarkerChange(evt.coordinate);
      handleUpdateLocationData(map, layers, evt.coordinate);
    });
  };

  useEffect(() => {
    const map = initializeMap();
    const layers = createLayers(map);

    const setupMap = async () => {
      await apply(map, styleUrl);
      map.getLayers().extend(layers);
      handleMapClick(map, layers);
    };

    const initialCoordinate = fromLonLat(INITIAL_COORDINATE);
    handleMarkerChange(initialCoordinate);
    handleUpdateLocationData(map, layers, initialCoordinate);
    setupMap();
    mapRef.current = map;

    return () => map.dispose();
  }, []);

  useEffect(() => {
    const source = layersRef.current?.getSource() as TileWMS;
    source?.updateParams({ TIME: time });
  }, [time]);

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
