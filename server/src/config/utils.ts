export const calculateAQI = (pm25: number | null): number => {
  const lerp = (aqiLow: number, aqiHigh: number, concLow: number, concHigh: number, conc: number): number => {
    if (concHigh === concLow) {
      return 0;
    }
    return aqiLow + ((conc - concLow) * (aqiHigh - aqiLow)) / (concHigh - concLow);
  };
  if (pm25 === null || isNaN(pm25)) {
    return 0;
  }

  const c = Math.round(pm25 * 10) / 10;
  if (c < 0) {
    return 0;
  } else if (c < 12.1) {
    return Math.round(lerp(0, 50, 0.0, 12.0, c));
  } else if (c < 35.5) {
    return Math.round(lerp(51, 100, 12.1, 35.4, c));
  } else if (c < 55.5) {
    return Math.round(lerp(101, 150, 35.5, 55.4, c));
  } else if (c < 150.5) {
    return Math.round(lerp(151, 200, 55.5, 150.4, c));
  } else if (c < 250.5) {
    return Math.round(lerp(201, 300, 150.5, 250.4, c));
  } else if (c < 350.5) {
    return Math.round(lerp(301, 400, 250.5, 350.4, c));
  } else if (c < 500.5) {
    return Math.round(lerp(401, 500, 350.5, 500.4, c));
  } else {
    return 500;
  }
};
