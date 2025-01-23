import { IPropsOpenLayerMap } from "@/components/types";
import { TimeContext } from "@/context";
import "@/open.css";
import { Map, View } from "ol";
import { apply } from "ol-mapbox-style";
import ImageLayer from "ol/layer/Image";
import TileLayer from "ol/layer/Tile";
import "ol/ol.css";
import { fromLonLat } from "ol/proj";
import { ImageWMS, TileWMS } from "ol/source";
import React, { useContext, useEffect, useRef } from "react";

const OpenLayerMap: React.FC<IPropsOpenLayerMap> = (props) => {
  const layersRef = useRef<TileLayer | null>(null);
  const { time } = useContext(TimeContext);

  useEffect(() => {
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
      controls: [],
    });

    const layers = [
      new TileLayer({
        source: new TileWMS({
          url: "http://localhost:8080/geoserver/air/wms",
          params: {
            LAYERS: "air:AQI",
            TIME: time,
            TILED: true,
            FORMAT: "image/png",
          },
          serverType: "geoserver",
          cacheSize: 4096,
        }),
        opacity: 1,
      }),
      new ImageLayer({
        source: new ImageWMS({
          url: "http://localhost:8080/geoserver/air/wms",
          params: {
            LAYERS: "air:gadm41_VNM_2",
            TIME: time,
            FORMAT: "image/png",
          },
          serverType: "geoserver",
        }),
        opacity: 1,
      }),
      new ImageLayer({
        source: new ImageWMS({
          url: "http://localhost:8080/geoserver/air/wms",
          params: {
            LAYERS: "air:gadm41_VNM_1",
            TIME: time,
            FORMAT: "image/png",
          },
          serverType: "geoserver",
        }),
        opacity: 1,
      }),
      new ImageLayer({
        source: new ImageWMS({
          url: "http://localhost:8080/geoserver/air/wms",
          params: {
            LAYERS: "air:gadm41_VNM_3",
            TIME: time,
            FORMAT: "image/png",
          },
          serverType: "geoserver",
        }),
        opacity: 1,
      }),
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
      }),
    ];

    layersRef.current = layers.at(0) as TileLayer;

    Promise.resolve(
      apply(map, styleUrl).then(() => {
        map.getLayers().extend(layers);
      }),
    );

    map.on("singleclick", function (evt) {
      const viewResolution = map.getView().getResolution();
      const wmsSource = layers[0].getSource();
      const url = wmsSource?.getFeatureInfoUrl(evt.coordinate, Number(viewResolution), "EPSG:3857", {
        INFO_FORMAT: "text/javascript",
        LAYERS: "air:AQI,air:gadm41_VNM_2,air:gadm41_VNM_1,air:gadm41_VNM_3",
        QUERY_LAYERS: "air:AQI,air:gadm41_VNM_2,air:gadm41_VNM_1,air:gadm41_VNM_3",
        SRS: "EPSG:3857",
        FEATURE_COUNT: 4,
      });

      if (url) {
        fetch(url).then((response) => {
          response.text().then((text) => {
            const jsonStr = text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1);
            const data = JSON.parse(jsonStr);

            if (data.features && data.features.length > 0) {
              const markLocation = data.features[1].properties;
              const vn_type = markLocation.TYPE_2;
              const vn_district = markLocation.NAME_2;
              const vn_province = markLocation.NAME_1;
              const aqi_index = data.features[0].properties.GRAY_INDEX;
              props.setMarkData({
                coordinate: [Number(evt.coordinate[0]), Number(evt.coordinate[1])],
                value: Number(aqi_index),
                location: [vn_type, vn_district].join(" ") + ", " + vn_province,
                time: data.timeStamp.split('T')[0].split("-").reverse().join("/"),
              });
            }
          });
        });
      }
    });

    return () => {
      map.dispose();
    };
  }, []);

  useEffect(() => {
    (layersRef.current?.getSource() as TileWMS).updateParams({
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
