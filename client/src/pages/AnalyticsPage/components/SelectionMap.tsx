import { AnalyticContext } from "@/context";
import useMapData from "@/hooks/useMapData";
import useProvinceData from "@/hooks/useProvinceData";
import { cn } from "@/lib/utils";
import { createMarkerLayer } from "@/pages/AppPage/components/OpenLayerMap/layers";
import { Map, View } from "ol";
import { Coordinate } from "ol/coordinate";
import GeoJSON from "ol/format/GeoJSON";
import { MultiPolygon, Point } from "ol/geom";
import VectorLayer from "ol/layer/Vector";
import { useContext, useEffect, useRef } from "react";
import { createProvinceBoundaryLayer } from "./mapLayers";

interface IPropsSelectionMap extends React.ComponentPropsWithoutRef<"div"> {}

const SelectionMap = ({ className }: IPropsSelectionMap) => {
  const mapRef = useRef<Map | null>(null);
  const markerRef = useRef<VectorLayer | null>(null);
  const analyticContext = useContext(AnalyticContext);
  const mapQuery = useMapData(analyticContext.province_id, "GID_1");
  const provinceMutation = useProvinceData(analyticContext.province_id, analyticContext.dateRange);

  const initializeMap = () => {
    return new Map({
      target: "selection-map",
      view: new View({
        zoom: 11,
        minZoom: 9,
        maxZoom: 14,
        constrainResolution: true,
        projection: "EPSG:3857",
      }),
    });
  };

  const handleMarkerChange = (coordinate: Coordinate) => {
    const markerFeature = markerRef.current?.getSource()?.getFeatures().at(0);
    if (markerFeature) {
      markerFeature.setGeometry(new Point(coordinate));
    }
    const features = mapRef.current?.getFeaturesAtPixel(mapRef.current.getPixelFromCoordinate(coordinate), {
      layerFilter: (layer) => layer instanceof VectorLayer && layer !== markerRef.current,
    });
    if (features?.length) {
      analyticContext.setAnalyticData((prev) => ({ ...prev, selectedDistrict: features[0].getProperties()["GID_2"] }));
    }
  };

  const centerMap = (map: Map) => {
    const format = new GeoJSON();
    const features = format.readFeatures(mapQuery.data.features[0]);
    const geometry = features[0].getGeometry() as MultiPolygon;
    const size = map.getSize();
    if (size) {
      const coordinates = geometry.getCoordinates()[0][0][0];
      map.getView().centerOn(coordinates, size, [size[0] / 2, size[1] / 2]);
    }
  };

  useEffect(() => {
    if (!mapQuery.data || !provinceMutation.data?.districtsData.length) return;

    const map = initializeMap();
    const vietnamBoundaryLayer = createProvinceBoundaryLayer(
      mapQuery.data,
      provinceMutation.data.districtsData,
      analyticContext.dataType,
    );
    const markerLayer = createMarkerLayer([]);

    map.getLayers().extend([vietnamBoundaryLayer, markerLayer]);
    centerMap(map);
    markerRef.current = markerLayer;
    mapRef.current = map;

    map.on("singleclick", (evt) => handleMarkerChange(evt.coordinate));

    return () => map.dispose();
  }, [mapQuery.data, provinceMutation.data?.districtsData, analyticContext.dataType]);

  return <div id="selection-map" className={cn("bg-white", className)} />;
};

export default SelectionMap;
