import { GEOSERVER_URL } from "@/pages/AppPage/components/OpenLayerMap/layers";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";

const useMapData = (location: string, filter: string) => {
    const mutation = useMutation({
        mutationKey: ["map", location],
        mutationFn: async () => {
            const response = await axios.get(`${GEOSERVER_URL}/wfs`, {
                params: {
                    SERVICE: "WFS",
                    version: "2.0.0",
                    REQUEST: "GetFeature",
                    typename: "air:gadm41_VNM_2",
                    CQL_FILTER: `${filter}='${location}'`,
                    outputFormat: "text/javascript",
                    srsname: "EPSG:3857",
                },
            });
            const jsonStartIndex = response.data.indexOf("{");
            const jsonEndIndex = response.data.lastIndexOf("}") + 1;
            return JSON.parse(response.data.slice(jsonStartIndex, jsonEndIndex));
        },
    });
    useEffect(() => {
        if (!location) return;
        mutation.mutate();
    }, [location]);

    return mutation;
};
export default useMapData;
