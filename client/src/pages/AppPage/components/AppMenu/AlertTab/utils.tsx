import { ConfigContext } from "@/context";
import { getWMSFeatureInfo } from "@/pages/AppPage/components/OpenLayerMap/functions";
import { createVietnamBoundaryLayer } from "@/pages/AppPage/components/OpenLayerMap/layers";
import { parseWMSResponse } from "@/pages/AppPage/components/OpenLayerMap/utils";
import { FeatureObject } from "ol/format/Feature";
import { Point } from "ol/geom";
import { fromLonLat } from "ol/proj";
import React, { useContext } from "react";
import { RegistrationDataType } from "./types";

export const getCurrentLocation = (
  setRegistrationData: React.Dispatch<React.SetStateAction<RegistrationDataType | null>>,
) => {
  const { mapRef, markerRef } = useContext(ConfigContext);
  const WAIT_TIME = 500;
  return () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const coordinate = fromLonLat([longitude, latitude]);

        if (!coordinate || !mapRef.current) return;

        const boundaryLayer = createVietnamBoundaryLayer(mapRef.current);

        mapRef.current.getView().animate({
          zoom: 13,
          center: coordinate,
          duration: WAIT_TIME,
        });

        const updateMarkerPosition = () => {
          const markerFeature = markerRef.current?.getSource()?.getFeatures().at(0);
          if (markerFeature) {
            markerFeature.setGeometry(new Point(coordinate));
          }
        };

        const fetchWmsData = async () => {
          if (!mapRef.current) return;

          const wmsURL = getWMSFeatureInfo(mapRef.current, [boundaryLayer], ["air:gadm41_VNM_2"], coordinate);

          if (wmsURL) {
            const data = await fetch(wmsURL).then(parseWMSResponse);
            const locationProperty = (data.features as FeatureObject[])[0]?.properties;
            if (!locationProperty) {
              setRegistrationData(null);
              return;
            }
            console.log(locationProperty);
            const locationData = {
              province_id: locationProperty["GID_1"],
              district_id: locationProperty["GID_2"],
              province_vn: locationProperty["NAME_1"],
              district_vn: locationProperty["NAME_2"],
              vn_type: locationProperty["TYPE_2"],
            };
            /* localStorage.setItem("alert_registration", JSON.stringify({ ...locationData, step: 0 })); */
            setRegistrationData({ ...locationData, step: 0 });
          }
        };

        const waitForZoomAndFetchData = async (attemptsLeft = 3) => {
          if (attemptsLeft <= 0) return;

          await new Promise((resolve) => setTimeout(resolve, WAIT_TIME));
          const currentZoom = mapRef.current?.getView().getZoom();

          if (currentZoom === 13) {
            updateMarkerPosition();
            fetchWmsData();
          } else {
            waitForZoomAndFetchData(attemptsLeft - 1);
          }
        };

        if (mapRef.current.getView().getZoom() === 13) {
          fetchWmsData();
        } else {
          waitForZoomAndFetchData();
        }
      } catch (error) {
        console.error("Error fetching district information:", error);
      }
    });
  };
};
