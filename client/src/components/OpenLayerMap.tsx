import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { TileWMS } from "ol/source";
import "ol/ol.css";
import "@/open.css";
import { useEffect, useRef } from "react";
import { apply } from "ol-mapbox-style";
import { fromLonLat } from "ol/proj";

interface IPropsOpenLayerMap {
  time: string;
}
const OpenLayerMap: React.FC<IPropsOpenLayerMap> = ({ time }) => {
  const layersRef = useRef<TileLayer[] | null>(null);

  useEffect(() => {
    const layers = [
      new TileLayer({
        source: new TileWMS({
          url: "http://localhost:8080/geoserver/air/wms",
          params: {
            LAYERS: "air:AQI",
            TIME: time,
            TILED: true,
          },
          serverType: "geoserver",
          cacheSize: 4096,
          crossOrigin: "anonymous",
        }),
        opacity: 0.6,
      }),
      new TileLayer({
        source: new TileWMS({
          url: "http://localhost:8080/geoserver/air/wms",
          params: {
            LAYERS: "air:gadm41_VNM_2",
            TILED: true,
          },
          serverType: "geoserver",
          cacheSize: 4096,
          crossOrigin: "anonymous",
        }),
        opacity: 0.4,
        maxZoom: 12,
      }),
    ];
    layersRef.current = layers;

    const key = "Y2LLlbvRVwaYxT2YxjWV";
    const styleUrl = `https://api.maptiler.com/maps/7d9ee8e1-7abf-4591-ac75-85518e48ba38/style.json?key=${key}`;

    const map = new Map({
      target: "map",

      view: new View({
        zoom: 8,
        constrainResolution: true,
        projection: "EPSG:3857",
        center: fromLonLat([105.97, 17.9459]),
      }),
    });
    Promise.resolve(
      apply(map, styleUrl).then(() => map.getLayers().extend([...layers])),
    );

    return () => {
      map.dispose();
    };
  }, []);

  useEffect(() => {
    (layersRef.current?.at(0)?.getSource() as TileWMS).updateParams({
      TIME: time,
    });
  }, [time]);
  return (
    <>
      <div id="map" className="absolute bottom-0 top-0 h-full w-full" />
    </>
  );
};

export default OpenLayerMap;
