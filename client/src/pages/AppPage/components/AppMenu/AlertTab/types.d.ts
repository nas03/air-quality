export type AlertContent = { aqi_index: string; recommendation: string; timestamp: string };
export type LocationDataType = {
    district_id: string;
    province_id: string;
    province_vn: string;
    district_vn: string;
    vn_type: string;
};
export type RegistrationDataType = LocationDataType & { step: number };
