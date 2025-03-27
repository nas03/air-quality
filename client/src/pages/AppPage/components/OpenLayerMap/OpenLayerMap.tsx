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
import { unByKey } from "ol/Observable";
import "ol/ol.css";
import { fromLonLat } from "ol/proj";
import { TileWMS } from "ol/source";
import VectorSource from "ol/source/Vector";
import React, { useContext, useEffect, useRef } from "react";
import { fetchLocationData, getWMSFeatureInfo } from "./functions";
import {
  createAQILayer,
  createMarkerLayer,
  createStationsLayer,
  createVietnamBoundaryLayer,
  createWindyLayer,
  updateAQILayer,
  updateStationLayer,
  updateWindLayer,
} from "./layers";

const OpenLayerMap: React.FC<IPropsOpenLayerMap> = (props) => {
  const aqiLayerRef = useRef<TileLayer | null>(null);
  const windLayerRef = useRef<WindLayer | null>(null);
  const layersRef = useRef<Array<TileLayer | VectorLayer | WindLayer> | null>(null);
  const markerRef = useRef<VectorLayer | null>(null);
  const mapRef = useRef<Map | null>(null);
  const { time } = useContext(TimeContext);
  const configContext = useContext(ConfigContext);

  const key = import.meta.env.VITE_PUBLIC_MAPTILER_KEY;
  const styleUrl = `https://api.maptiler.com/maps/7d9ee8e1-7abf-4591-ac75-85518e48ba38/style.json?key=${key}`;
  const INITIAL_COORDINATE = [105.871, 21];

  const initializeMap = () => {
    const viewConfig = {
      zoom: 9,
      constrainResolution: true,
      projection: "EPSG:3857",
      center: fromLonLat(INITIAL_COORDINATE),
      minZoom: 7,
    };

    const zoomControlStyles = {
      className: "top-[5rem] right-3 rounded-full w-fit h-fit bg-white ",
      zoomInClassName: "!rounded-full !w-fit !h-fit !py-4 !px-3 hover:bg-blue-100 !outline-blue-400",
      zoomOutClassName: "!rounded-full !w-fit !h-fit !py-4 !px-3 hover:bg-blue-100 !outline-blue-400",
    };

    return new Map({
      target: "map",
      view: new View(viewConfig),
      controls: defaultControls({
        zoomOptions: zoomControlStyles,
      }),
    });
  };

  const createLayers = async (map: Map) => {
    const aqiLayer = createAQILayer(time);
    const boundaryLayer = createVietnamBoundaryLayer(map);
    const stationsLayer = createStationsLayer(time);
    const markerLayer = createMarkerLayer(INITIAL_COORDINATE);
    const windyLayer = await createWindyLayer(time);

    const layers = [aqiLayer, boundaryLayer, stationsLayer, markerLayer, windyLayer];

    aqiLayerRef.current = aqiLayer as TileLayer;
    windLayerRef.current = windyLayer as WindLayer;
    markerRef.current = markerLayer as VectorLayer;

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
    const modelLayers = ["air:aqi_map", "air:gadm41_VNM_2", "air:gadm41_VNM_1", "air:gadm41_VNM_3"];
    const modelURL = getWMSFeatureInfo(map, mapLayers, modelLayers, coordinate);

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
    if (!map || !marker || !layersRef.current) return;

    const markerFeature = marker.getSource()?.getFeatures()[0];
    if (!markerFeature) return;

    const coordinate = markerFeature.getGeometry()?.getCoordinates();
    if (coordinate) {
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
    const stationSource = layersRef.current?.at(2)?.getSource() as VectorSource;
    const AQISource = aqiLayerRef.current?.getSource() as TileWMS;
    const windLayer = windLayerRef.current;

    stationSource && updateStationLayer(stationSource, time);
    AQISource && updateAQILayer(AQISource, time);
    windLayer && updateWindLayer(windLayer, time);
  }, [time]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const updateWindLayerVisibility = () => {
      const zoom = map.getView().getZoom();
      const windLayer = map.getLayers().getArray()[6];
      if (!zoom || !windLayer) return;

      if (zoom >= 11) {
        windLayer.setVisible(false);
      } else {
        windLayer.setVisible(configContext.layer.wind);
      }
    };

    const handlePointerDown = () => {
      const windLayer = map.getLayers().getArray()[6];
      if (windLayer) windLayer.setVisible(false);
    };

    const handlePointerUp = () => {
      const windLayer = map.getLayers().getArray()[6];
      const zoom = map.getView().getZoom();
      if (windLayer && zoom && zoom < 11) {
        windLayer.setVisible(configContext.layer.wind);
      }
    };

    const mapElement = document.getElementById("map");
    mapElement?.addEventListener("pointerdown", handlePointerDown);
    mapElement?.addEventListener("pointerup", handlePointerUp);

    updateWindLayerVisibility();

    const zoomListener = map.getView().on("change:resolution", updateWindLayerVisibility);

    return () => {
      unByKey(zoomListener);
      mapElement?.removeEventListener("pointerdown", handlePointerDown);
      mapElement?.removeEventListener("pointerup", handlePointerUp);
    };
  }, [configContext.layer.wind]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const [, , aqiLayer, boundaryLayer, stationsLayer, ,] = map.getLayers().getArray();

    if (!aqiLayer || !boundaryLayer || !stationsLayer) return;

    aqiLayer.setVisible(configContext.layer.model);
    boundaryLayer.setVisible(configContext.layer.model);
    stationsLayer.setVisible(configContext.layer.station);
  }, [configContext.layer]);

  return (
    <>
      <div id="map" className={cn("", props.className)} />
    </>
  );
};

export default OpenLayerMap;
