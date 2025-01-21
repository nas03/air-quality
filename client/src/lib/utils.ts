import { clsx, type ClassValue } from "clsx";
import proj4 from "proj4";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertCoordinate = (from: string, to: string, coordinate: [number, number] | undefined) => {
  if (!coordinate) return null;
  const [lon, lat] = proj4(from, to, coordinate);
  return [lat.toFixed(3), lon.toFixed(3)];
};
