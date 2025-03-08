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
export const aqiThresholds = [50, 100, 150, 200, 500];
export const pm25Thresholds = [12, 36, 56, 150, 200];
export const colorMap = ["#009966", "#facf39", "#ea7643", "#f65e5f", "#70006a", "#7e0023"];
export const getGradientDefs = (id: string) => {
  return [
    <defs key={`gradient-0-${id}`}>
      <linearGradient id={id} x2="0" y2="1">
        <stop offset="0%" stopColor={colorMap[0]} />
        <stop offset="100%" stopColor={colorMap[0]} />
      </linearGradient>
    </defs>,
    <defs key={`gradient-1-${id}`}>
      <linearGradient id={id} x2="0" y2="1">
        <stop offset="0%" stopColor={colorMap[1]} />
        <stop offset="100%" stopColor={colorMap[0]} />
      </linearGradient>
    </defs>,
    <defs key={`gradient-2-${id}`}>
      <linearGradient id={id} x2="0" y2="1">
        <stop offset="0%" stopColor={colorMap[2]} />
        <stop offset="66.7%" stopColor={colorMap[1]} />
        <stop offset="100%" stopColor={colorMap[0]} />
      </linearGradient>
    </defs>,
    <defs key={`gradient-3-${id}`}>
      <linearGradient id={id} x2="0" y2="1">
        <stop offset="0%" stopColor={colorMap[3]} />
        <stop offset="50%" stopColor={colorMap[2]} />
        <stop offset="75%" stopColor={colorMap[1]} />
        <stop offset="100%" stopColor={colorMap[0]} />
      </linearGradient>
    </defs>,
    <defs key={`gradient-4-${id}`}>
      <linearGradient id={id} x2="0" y2="1">
        <stop offset="0%" stopColor={colorMap[5]} />
        <stop offset="20%" stopColor={colorMap[4]} />
        <stop offset="40%" stopColor={colorMap[3]} />
        <stop offset="60%" stopColor={colorMap[2]} />
        <stop offset="80%" stopColor={colorMap[1]} />
        <stop offset="100%" stopColor={colorMap[0]} />
      </linearGradient>
    </defs>,
  ];
};

export const receiveNotification = Object.freeze({
  DISABLED: 0,
  EMAIL_NOTIFICATION: 1,
  SMS_NOTIFICATION: 2,
  BOTH: 3,
});
