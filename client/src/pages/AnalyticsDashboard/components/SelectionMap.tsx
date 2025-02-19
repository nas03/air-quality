import { cn } from "@/lib/utils";
import axios from "axios";
import { Map, View } from "ol";
import { getBottomLeft } from "ol/extent";
import GeoJSON from "ol/format/GeoJSON";
import { MultiPolygon } from "ol/geom";
import TileLayer from "ol/layer/Tile";
import { TileWMS } from "ol/source";
import { useEffect, useRef } from "react";

interface IPropsSelectionMap extends React.ComponentPropsWithoutRef<"div"> {}
const SelectionMap: React.FC<IPropsSelectionMap> = ({ className }) => {
  const mapRef = useRef<Map | null>(null);
  const createVietnamBoundaryLayer = (map: Map) =>
    new TileLayer({
      source: new TileWMS({
        url: "http://localhost:8080/geoserver/air/wms",
        params: {
          LAYERS: "air:gadm41_VNM",
          FORMAT: "image/png",
          TILED: true,
          CQL_FILTER: "NAME_1='Hà Nội'",
          tilesorigin: getBottomLeft(map.getView().getProjection().getExtent()).toString(),
          EXCEPTIONS: "application/vnd.ogc.se_inimage",
        },
        serverType: "geoserver",
        cacheSize: 4096,
      }),
      opacity: 1,
    });
  const createLayers = (map: Map) => {
    const layers = [createVietnamBoundaryLayer(map)];
    return layers;
  };

  const initializeMap = () => {
    return new Map({
      target: "selection-map",
      view: new View({
        zoom: 10, // increased zoom for better view of Hanoi
        constrainResolution: true,
        projection: "EPSG:3857",
      }),
    });
  };

  const getGeometryCenter = async (map: Map) => {
    const response = await axios.get("http://localhost:8080/geoserver/wfs", {
      params: {
        SERVICE: "WFS",
        version: "2.0.0",
        REQUEST: "GetFeature",
        typename: "air:gadm41_VNM_2",
        CQL_FILTER: "NAME_1='Hà Nội'",
        outputFormat: "text/javascript",
        srsname: "EPSG:3857",
      },
    });
    const jsonStartIndex = response.data.indexOf("{");
    const jsonEndIndex = response.data.lastIndexOf("}") + 1;
    const data = JSON.parse(response.data.slice(jsonStartIndex, jsonEndIndex));
    const format = new GeoJSON();
    const features = format.readFeatures(data.features[0]);
    const geometry = features[0].getGeometry() as MultiPolygon;

    const size = map.getSize();
    if (!size) return;
    const coordinates = geometry.getCoordinates()[0][0][0];
    map.getView().centerOn(coordinates, size, [size[0] / 2, size[1] / 2]);
  };

  useEffect(() => {
    const map = initializeMap();
    const layers = createLayers(map);

    map.getLayers().extend(layers);
    getGeometryCenter(map);
    mapRef.current = map;

    return () => map.dispose();
  }, []);

  return (
    <>
      <div id="selection-map" className={cn("bg-white", className)} />
    </>
  );
};

export default SelectionMap;
