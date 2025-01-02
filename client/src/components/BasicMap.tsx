import "iso8601";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useRef } from "react";
import "@/geoserver.css";
import "@mladen/leaflet.tilelayer.wmts";
interface IPropsMapComponent {
  time: string;
}

const MapComponent: React.FC<IPropsMapComponent> = ({ time }) => {
  const mapRef = useRef(null);
  const wmsLayerRef = useRef<L.TileLayer.WMS | null>(null);

  useEffect(() => {
    // Initialize map
    const map = L.map("map", {
      zoom: 6,
      zoomControl: false,
      preferCanvas: true,
      center: [17.9459, 105.97],
    });

    // Add zoom control
    L.control.zoom({ position: "topright" }).addTo(map);

    // Add focus control
    const focusControlSpan = document.createElement("span");
    focusControlSpan.setAttribute("aria-hidden", "true");
    focusControlSpan.style.fontSize = "17px";
    focusControlSpan.style.lineHeight = "30px";
    focusControlSpan.classList.add("fa-solid", "fa-expand");

    const focusControl = document.createElement("a");
    focusControl.appendChild(focusControlSpan);
    focusControl.classList.add("zoom-control-focus");
    focusControl.addEventListener("click", () => {
      map.setZoom(8);
    });
    // @ts-ignore
    document.querySelector(".leaflet-control-zoom").prepend(focusControl);

    // Add tile layer
    L.tileLayer(
      "https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=Y2LLlbvRVwaYxT2YxjWV",
      {
        attribution:
          '\u003ca href="https://www.maptiler.com/copyright/" target="_blank"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href="https://www.openstreetmap.org/copyright" target="_blank"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e',
      },
    ).addTo(map);

    // Add WMS layer
    const wmsLayer = L.tileLayer.wms(
      "http://localhost:8080/geoserver/air/wms",
      {
        layers: "air:precipitation",
        format: "image/png",
        transparent: true,
        opacity: 0.8,
      },
    );
    //@ts-ignore
    wmsLayer.wmsParams.time = time;
    wmsLayer.addTo(map);
    wmsLayerRef.current = wmsLayer;
    /* Test WMTS */
    // @ts-ignore

    /* const wmtsLayer = new L.TileLayer.WMTS(
      "http://localhost:8080/geoserver/air/service/wmts",
      {
        layer: "air:precipitation",
        tilematrixSet: "PM",
        format: "image/jpeg",
      },
    );
    map.addLayer(wmtsLayer);
    const baseLayer = {
      base: wmtsLayer,
    };
    L.control.layers(baseLayer, {}).addTo(map); */

    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    if (wmsLayerRef.current) {
      // @ts-ignore
      wmsLayerRef.current.setParams({ time: time });
    }
  }, [time]);

  return (
    <div id="map" ref={mapRef} style={{ width: "100%", height: "100%" }} />
  );
};

export default MapComponent;
