import { getRecommendationDefinition } from "@/api";
import { convertCoordinate } from "@/lib/utils";
import { GeoContextType } from "@/types/contexts";
import { AirQualityData } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const getProjectedCoordinates = (geoContext: GeoContextType) => {
  const sourceProjection = "EPSG:3857";
  const targetProjection = geoContext.type === 0 ? "EPSG:4326" : "EPSG:3857";
  const converted = convertCoordinate(sourceProjection, targetProjection, geoContext.coordinate);
  return converted ? converted.map(Number) : null;
};
const useAirQualityData = (time: string, geoContext: GeoContextType) => {
  const [data, setData] = useState<AirQualityData>({
    aqi_index: 0,
    pm_25: 0,
    status: "string",
    time,
    name: "",
    location: "",
    recommendation: "",
    wind_speed: 0,
  });

  const { data: recommendations } = useQuery({
    queryKey: ["recommendations", "all"],
    queryFn: getRecommendationDefinition,
  });

  const findRecommendation = (value: number) => {
    if (!recommendations) return { recommendation: "", status: "" };
    const recommendation = recommendations.find((r) => value >= r.min_threshold && value <= r.max_threshold);
    return { recommendation: recommendation?.en_recommendation || "", status: recommendation?.en_status || "" };
  };

  const buildAirQualityData = (geoContext: GeoContextType, projectedCoordinate: number[] | null): AirQualityData => {
    const recommendation = findRecommendation(Number(geoContext.aqi_index));
    return {
      aqi_index: geoContext.aqi_index ?? 0,
      pm_25: geoContext.pm_25 ?? 0,
      status: recommendation.status,
      time,
      name: geoContext.location,
      location: projectedCoordinate
        ? [String(projectedCoordinate[0].toFixed(2)), String(projectedCoordinate[1].toFixed(2))]
        : ["--", "--"],
      recommendation: recommendation.recommendation,
      wind_speed: geoContext.wind_speed ? Number(geoContext.wind_speed.toPrecision(2)) : 0,
    };
  };

  const updateData = () => {
    const projectedCoordinate = getProjectedCoordinates(geoContext);
    if (geoContext.type === 0 && !projectedCoordinate) return;

    const updatedData = buildAirQualityData(geoContext, projectedCoordinate);
    setData((prev) => ({ ...prev, ...updatedData }));
  };

  return { data, updateData };
};

export default useAirQualityData;
