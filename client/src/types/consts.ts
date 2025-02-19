export const MonitoringData = Object.freeze({
  INPUT: {
    MODEL: 0,
    STATION: 1,
  } as const,
  OUTPUT: {
    AQI: 0,
    PM25: 1,
  } as const,
});
