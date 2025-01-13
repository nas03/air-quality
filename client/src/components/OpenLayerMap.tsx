import { IPropsOpenLayerMap } from "@/components/types";
import { TimeContext } from "@/context";
import "@/open.css";
import { Map, View } from "ol";
import { apply } from "ol-mapbox-style";
import TileLayer from "ol/layer/Tile";
import "ol/ol.css";
import { fromLonLat } from "ol/proj";
import { TileWMS } from "ol/source";
import { useContext, useEffect, useRef } from "react";
const OpenLayerMap: React.FC<IPropsOpenLayerMap> = (props) => {
  const layersRef = useRef<TileLayer[] | null>(null);
  const { time } = useContext(TimeContext);
  // const configContext = useContext(ConfigContext);
  useEffect(() => {
    const layers = [
      new TileLayer({
        source: new TileWMS({
          url: "http://localhost:8080/geoserver/air/wms",
          params: { LAYERS: "air:air", TIME: time, TILED: true },
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

    Promise.resolve(
      apply(map, styleUrl).then(() => {
        map.getLayers().extend([...layers]);
      }),
    );

    map.on("singleclick", function (evt) {
      const viewResolution = map.getView().getResolution();
      const wmsSource = layers[0].getSource();
      const url = wmsSource?.getFeatureInfoUrl(evt.coordinate, Number(viewResolution), "EPSG:3857", {
        INFO_FORMAT: "application/json",
        QUERY_LAYERS: "air:air",
        SRS: "EPSG:3857",
        FEATURE_COUNT: 50,
      });
      if (url) {
        fetch(url).then((response) => {
          response.json().then((res) => {
            const markLocation = res.features[1].properties;
            const vn_type = markLocation.TYPE_2;
            const vn_district = markLocation.NAME_2;
            const vn_province = markLocation.NAME_1;
            props.setMarkData({
              coordinate: [Number(evt.coordinate[0]), Number(evt.coordinate[1])],
              value: Number(res.features[0].properties.GRAY_INDEX),
              location: [vn_type, vn_district].join(" ") + ", " + vn_province,
            });
            console.log(res);
          });
        });
      }
    });
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
