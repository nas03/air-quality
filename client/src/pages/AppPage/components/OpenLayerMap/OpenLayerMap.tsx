import { IPropsOpenLayerMap } from "@/components/types";
import { ConfigContext, TimeContext } from "@/context";
import "@/css/open.css";
import { cn } from "@/lib/utils";
import { Map, View } from "ol";
import { apply } from "ol-mapbox-style";
import { WindLayer } from "ol-wind";
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
import {
  createAQILayer,
  createMarkerLayer,
  createStationsLayer,
  createVietnamBoundaryLayer,
  createWindyLayer,
} from "./layers";

const OpenLayerMap: React.FC<IPropsOpenLayerMap> = (props) => {
  const aqiLayerRef = useRef<TileLayer | null>(null);
  const layersRef = useRef<Array<TileLayer | VectorLayer | WindLayer> | null>(null);
  const markerRef = useRef<VectorLayer | null>(null);
  const mapRef = useRef<Map | null>(null);
  const { time } = useContext(TimeContext);
  const configContext = useContext(ConfigContext);

  const key = import.meta.env.VITE_PUBLIC_MAPTILER_KEY;
  const styleUrl = `https://api.maptiler.com/maps/7d9ee8e1-7abf-4591-ac75-85518e48ba38/style.json?key=${key}`;
  const INITIAL_COORDINATE = [105.871, 21];
  const DEFAULT_STATION_TIME = "2025-02-13T19:00:00Z";
  const initializeMap = () => {
    return new Map({
      target: "map",
      view: new View({
        zoom: 8,
        constrainResolution: true,
        projection: "EPSG:3857",
        center: fromLonLat([105.97, 17.9459]),
        minZoom: 6,
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

  const createLayers = async (map: Map) => {
    const layers = [
      createAQILayer(time),
      createVietnamBoundaryLayer(map),
      createStationsLayer(DEFAULT_STATION_TIME),
      createMarkerLayer(INITIAL_COORDINATE),
      await createWindyLayer(),
    ];
    aqiLayerRef.current = layers[0] as TileLayer;
    markerRef.current = layers[3] as VectorLayer;
    configContext.setMarker(markerRef.current);
    return layers;
  };

  const handleMarkerChange = (coordinate: Coordinate) => {
    const markerFeature = markerRef.current?.getSource()?.getFeatures().at(0);
    if (markerFeature) {
      markerFeature.setGeometry(new Point(coordinate));
    }
  };

  const handleUpdateLocationData = (
    map: Map,
    mapLayers: (TileLayer | VectorLayer | WindLayer)[],
    coordinate: Coordinate,
  ) => {
    const modelLayers = ["air:AQI", "air:gadm41_VNM_2", "air:gadm41_VNM_1", "air:gadm41_VNM_3"];
    const modelURL = getWMSFeatureInfo(map, mapLayers, modelLayers, coordinate);
    // const stationLayers = ["air:stations_point_map"];

    /* const stationURL = getWMSFeatureInfo(map, mapLayers, stationLayers, coordinate, "2025-02-13T19:00:00Z"); */

    if (!modelURL) {
      console.error("Failed to generate WMS URLs for location data");
      return;
    }

    fetchLocationData(modelURL, coordinate, props.setMarkData, configContext, mapRef, markerRef);
  };

  const handleMapClick = (map: Map, layers: (TileLayer<TileWMS> | VectorLayer | WindLayer)[]) => {
    map.on("singleclick", function (evt) {
      handleMarkerChange(evt.coordinate);
      handleUpdateLocationData(map, layers, evt.coordinate);
    });
  };

  useEffect(() => {
    const map = mapRef.current;
    const marker = configContext.markerRef?.current;

    if (!map || !marker) return;

    const markerFeature = marker.getSource()?.getFeatures()[0];
    if (!markerFeature) return;

    const coordinate = markerFeature.getGeometry()?.getCoordinates();
    if (!coordinate) return;

    if (map && layersRef.current) {
      handleUpdateLocationData(map, layersRef.current, coordinate);
    }
  }, [configContext.currentCoordinate]);

  useEffect(() => {
    const map = initializeMap();
    const setupMap = async () => {
      const layers = await createLayers(map);
      layersRef.current = layers;
      await apply(map, styleUrl);
      map.getLayers().extend(layers);
      handleMapClick(map, layers);
      const initialCoordinate = fromLonLat(INITIAL_COORDINATE);
      handleMarkerChange(initialCoordinate);
      handleUpdateLocationData(map, layers, initialCoordinate);
    };

    mapRef.current = map;
    configContext.setMap(map);
    setupMap();

    return () => map.dispose();
  }, []);

  useEffect(() => {
    const source = aqiLayerRef.current?.getSource() as TileWMS;
    source?.updateParams({ TIME: time });
  }, [time]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const [, , aqiLayer, boundaryLayer, stationsLayer, , windLayer] = map.getLayers().getArray();

    const updateLayerVisibility = (layer: any, isVisible: boolean) => {
      layer?.setVisible(isVisible);
    };

    updateLayerVisibility(aqiLayer, configContext.layer.model);
    updateLayerVisibility(boundaryLayer, configContext.layer.model);
    updateLayerVisibility(stationsLayer, configContext.layer.station);
    updateLayerVisibility(windLayer, configContext.layer.wind);
  }, [configContext.layer]);

  return (
    <>
      <div id="map" className={cn("", props.className)} />
    </>
  );
};

export default OpenLayerMap;
