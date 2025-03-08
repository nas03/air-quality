import { ConfigContext } from "@/context";
import { Point } from "ol/geom";
import { fromLonLat } from "ol/proj";
import { useContext } from "react";
import { TbLocation } from "react-icons/tb";

interface IPropsCurrentLocationData extends React.ComponentPropsWithRef<"div"> {}
const CurrentLocationData: React.FC<IPropsCurrentLocationData> = () => {
  const { markerRef, mapRef, setCurrentCoordinate } = useContext(ConfigContext);
  const WAIT_TIME = 500;

  const setCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      try {
        const { latitude, longitude } = position.coords;
        const coordinate = fromLonLat([longitude, latitude]);

        if (!coordinate || !mapRef.current) return;

        mapRef.current.getView().animate(
          {
            zoom: 13,
            center: coordinate,
            duration: WAIT_TIME,
          },
          () => {
            const markerFeature = markerRef.current?.getSource()?.getFeatures().at(0);
            if (markerFeature) {
              markerFeature.setGeometry(new Point(coordinate));
              setCurrentCoordinate(coordinate);
            }
            return true;
          },
        );
      } catch (error) {
        console.error("Error updating current location:", error);
      }
    });
  };
  return (
    <>
      <TbLocation size={35} className="rounded-md bg-white p-2 hover:bg-blue-400 hover:text-white" onClick={setCurrentLocation} />
    </>
  );
};

export default CurrentLocationData;
