import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM, TileWMS } from "ol/source";
import "ol/ol.css";
import "@/open.css";
import { useEffect, useRef } from "react";
interface IPropsOpenLayerMap {
  time: string;
}
const OpenLayerMap: React.FC<IPropsOpenLayerMap> = ({ time }) => {
  const mapRef = useRef(null);
  const wmsLayerRef = useRef<TileLayer<TileWMS> | null>(null);
  useEffect(() => {
    const map = new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new OSM({
            url: "https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=Y2LLlbvRVwaYxT2YxjWV",
            attributions:
              '\u003ca href="https://www.maptiler.com/copyright/" target="_blank"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href="https://www.openstreetmap.org/copyright" target="_blank"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e',
          }),
        }),
      ],
      view: new View({
        center: [105.97, 17.9459],
        projection: "EPSG:4326",
        zoom: 8,
      }),
    });
    const wmsLayer = new TileLayer({
      source: new TileWMS({
        url: "http://localhost:8080/geoserver/air/wms",
        projection: "EPSG:4326",
        params: {
          LAYERS: "air:precipitation",
          TIME: time,
          TILED: true,
        },
        serverType: "geoserver",
      }),
    });
    map.addLayer(wmsLayer);
    wmsLayerRef.current = wmsLayer;
    return () => {
      map.dispose();
    };
  }, []);

  useEffect(() => {
    wmsLayerRef.current?.getSource()?.updateParams({ TIME: time });
  }, [time]);
  return (
    <>
      <div id="map" className="absolute bottom-0 top-0 h-full w-full" />
    </>
  );
};

export default OpenLayerMap;
