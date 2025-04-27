import axios from "axios";
const api = axios.create({
    baseURL: "http://api.nas03.xyz:5500/api",

    // baseURL: "http://ec2-18-136-124-168.ap-southeast-1.compute.amazonaws.com:5500/api",
});

export default api;
