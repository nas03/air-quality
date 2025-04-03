import { getRecommendationDefinition } from "@/api";
import { convertCoordinate } from "@/lib/utils";
import { GeoContextType } from "@/types/contexts";
import { AirQualityData } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const getProjectedCoordinates = (geoContext: GeoContextType): number[] | null => {
  const sourceProjection = "EPSG:3857";
  const targetProjection = geoContext.type === 0 ? "EPSG:4326" : "EPSG:3857";
  const converted = convertCoordinate(sourceProjection, targetProjection, geoContext.coordinate);
  return converted ? converted.map(Number) : null;
};

const formatCoordinates = (coordinates: number[] | null): [string, string] => {
  if (!coordinates) return ["--", "--"];
  return [coordinates[0].toFixed(2), coordinates[1].toFixed(2)];
};

const formatTimeString = (baseTime: string, contextTime?: string): string => {
  if (!contextTime) return baseTime;

  const date = new Date(contextTime);
  if (date.toString() === "Invalid Date") return contextTime;

  const formatted = date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const parts = formatted.split("/");
  return [parts[1], parts[0], parts[2]].join("/");
};

const useAirQualityData = (time: string, geoContext: GeoContextType) => {
  const [data, setData] = useState<AirQualityData>({
    aqi_index: 0,
    pm_25: 0,
    status: "",
    time: time,
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

    const matchingRecommendation = recommendations.find((r) => value >= r.min_threshold && value <= r.max_threshold);

    return {
      recommendation: matchingRecommendation?.vn_recommendation || "",
      status: matchingRecommendation?.vn_status || "",
    };
  };

  const buildAirQualityData = (geoContext: GeoContextType, projectedCoordinate: number[] | null): AirQualityData => {
    const { recommendation, status } = findRecommendation(Number(geoContext.aqi_index));
    const timeString = formatTimeString(time, geoContext.time);
    const [lon, lat] = formatCoordinates(projectedCoordinate);

    return {
      aqi_index: geoContext.aqi_index ?? 0,
      pm_25: geoContext.pm_25 ?? 0,
      status,
      time: timeString,
      name: geoContext.location,
      location: [lon, lat],
      recommendation,
      wind_speed: geoContext.wind_speed ? Number(geoContext.wind_speed.toPrecision(2)) : 0,
    };
  };

  // Update the air quality data based on the current geo context
  const updateData = () => {
    const projectedCoordinate = getProjectedCoordinates(geoContext);

    if (geoContext.type === 0 && !projectedCoordinate) return;

    const updatedData = buildAirQualityData(geoContext, projectedCoordinate);
    setData((prev) => ({ ...prev, ...updatedData }));
  };

  return { data, updateData, getProjectedCoordinates };
};

export default useAirQualityData;
