import proj4 from "proj4";

export const convertCoordinate = (from: string, to: string, coordinate: [number, number] | undefined) => {
    /*  const EPSG3857 = "EPSG:3857"; // Web Mercator
  const EPSG4326 = "EPSG:4326"; // WGS84 Lat/Lon */
    if (!coordinate) return null;
    // Convert the coordinates
    const [lon, lat] = proj4(from, to, coordinate);

    return [lat.toFixed(3), lon.toFixed(3)];
};
