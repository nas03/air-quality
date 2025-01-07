import { TimeContext } from "@/context";
import "@/open.css";
import { Map, View } from "ol";
import { apply } from "ol-mapbox-style";
import TileLayer from "ol/layer/Tile";
import "ol/ol.css";
import { fromLonLat } from "ol/proj";
import { TileWMS } from "ol/source";
import { useContext, useEffect, useRef } from "react";

interface IPropsOpenLayerMap {
  // time: string;
}
const OpenLayerMap: React.FC<IPropsOpenLayerMap> = () => {
  const layersRef = useRef<TileLayer[] | null>(null);
  const { time } = useContext(TimeContext);
  useEffect(() => {
    const layers = [
      new TileLayer({
        source: new TileWMS({
          url: "http://localhost:8080/geoserver/air/wms",
          params: {
            LAYERS: "air:air",
            TIME: time,
            TILED: true,
          },
          serverType: "geoserver",
          cacheSize: 4096,
          crossOrigin: "anonymous",
        }),
        opacity: 1,
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
    Promise.resolve(apply(map, styleUrl).then(() => map.getLayers().extend([...layers])));

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
