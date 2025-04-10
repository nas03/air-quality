import { aqiThresholds, colorMap, getGradientDefs, MonitoringData, pm25Thresholds } from "@/types/consts";
import { MonitoringOutputDataType } from "@/types/types";
import { Map } from "ol";
import GeoJSON from "ol/format/GeoJSON";
import { MultiPolygon, Point } from "ol/geom";
// const _color = ["#009966", "#facf39", "#ea7643", "#fe6a6", "#70006a", "#7e0023"];

export const getGradient = (id: string, data: number[], chartType: MonitoringOutputDataType) => {
    const value = Math.max(...data);
    const configs = {
        [MonitoringData.OUTPUT.AQI]: {
            thresholds: aqiThresholds,
        },
        [MonitoringData.OUTPUT.PM25]: {
            thresholds: pm25Thresholds,
        },
    };
    const gradientIndex = configs[chartType].thresholds.findIndex((d) => value <= d);
    return getGradientDefs(id)[gradientIndex];
};

export const getStyleRankTable = (aqi_index: number) => {
    if (aqi_index < 50) return { status: "Good", color: colorMap[0] };
    else if (aqi_index < 100) return { status: "Moderate", color: colorMap[1] };
    else if (aqi_index < 150) return { status: "Unhealthy for Sensitive Groups", color: colorMap[2] };
    else if (aqi_index < 200) return { status: "Unhealthy", color: colorMap[3] };
    else if (aqi_index < 300) return { status: "Very Unhealthy", color: colorMap[4] };
    else return { status: "Hazardous", color: colorMap[5] };
};

export const getSvgAndColorByAQI = (aqi_index: number) => {
    if (aqi_index < 50) return { icon: "ic-face-green.svg", color: "#009966" };
    else if (aqi_index < 100) return { icon: "ic-face-yellow.svg", color: "#facf39" };
    else if (aqi_index < 150) return { icon: "ic-face-orange.svg", color: "#ea7643" };
    else if (aqi_index < 200) return { icon: "ic-face-red.svg", color: "#f65e5f" };
    else if (aqi_index < 300) return { icon: "ic-face-purple.svg", color: "#a97abc" };
    else return { icon: "ic-face-purple.svg", color: "#a97abc" };
};

export const centerMapOnDistrict = (
    map: Map,
    feature: GeoJSON.Feature,
    markerRef: React.MutableRefObject<any>,
): void => {
    const format = new GeoJSON();
    const features = format.readFeatures(feature);
    if (!features.length) return;

    const geometry = features[0].getGeometry() as MultiPolygon;
    const size = map.getSize();
    if (!size) return;

    const markerFeature = markerRef.current?.getSource()?.getFeatures().at(0);
    const coordinates = geometry.getCoordinates()[0][0][0];

    if (markerFeature) {
        const extent = geometry.getExtent();
        const center = [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2];
        markerFeature.setGeometry(new Point(center));
        map.getView().centerOn(coordinates, size, [size[0] / 2, size[1] / 2]);
    }
};
