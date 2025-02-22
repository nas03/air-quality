import { colorMap } from "@/types/consts";
import { MDistrict, Statistic } from "@/types/db";
import GeoJSON from "ol/format/GeoJSON";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Fill, Stroke, Style, Text } from "ol/style";

export const createProvinceBoundaryLayer = (
  mapData: any,
  provinceData: (Pick<Statistic, "aqi_index"> & MDistrict)[],
) => {
  const format = new GeoJSON();
  const features = format.readFeatures(mapData);

  const getAQIByDistrict = (district_id: string) => {
    const district = provinceData?.find((d: any) => d.district_id == district_id);
    if (!district) return district_id;
    return `${district.vn_district}: ${Math.ceil(Number(district.aqi_index))}`;
  };

  const getColorByAQI = (district_id: string) => {
    const data = provinceData?.find((d) => d.district_id === district_id);
    const aqi_index = Math.ceil(Number(data?.aqi_index)) || 0;
    if (aqi_index <= 50) return colorMap[0];
    else if (aqi_index <= 100) return colorMap[1];
    else if (aqi_index <= 150) return colorMap[2];
    else if (aqi_index <= 200) return colorMap[3];
    else if (aqi_index <= 300) return colorMap[4];
    else return colorMap[5];
  };

  return new VectorLayer({
    source: new VectorSource({ features }),
    style: (feature) =>
      new Style({
        text: new Text({
          text: getAQIByDistrict(feature.get("GID_2")),
          fill: new Fill({ color: "#000" }),
          scale: 1.2,
          stroke: new Stroke({ color: "#fff", width: 2 }),
        }),
        fill: new Fill({ color: getColorByAQI(feature.get("GID_2")) }),
        stroke: new Stroke({ color: "#3399CC", width: 1 }),
      }),
  });
};
