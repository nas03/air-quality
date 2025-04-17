import { resMessage, statusCode } from "@/config/constant";
import { alertMailTemplate } from "@/config/mailTemplate";
import { MailService } from "@/services";
import axios from "axios";
import dotenv from "dotenv";
import { Request, Response } from "express";
import { DistrictInteractor, StatisticInteractor } from "../interactors";
import { AlertSettingInteractor } from "../interactors/alertSettingInteractor";
import { BaseController } from "./baseController";
import { OpenWeatherCurrentDataType, OpenWeatherForecastDataType } from "./types";
dotenv.config();

export class AlertSettingController extends BaseController<
    [AlertSettingInteractor, DistrictInteractor, StatisticInteractor]
> {
    private alertSettingInteractor = this.interactors[0];
    private districtInteractor = this.interactors[1];
    private statisticInteractor = this.interactors[2];
    private readonly mailService: MailService = new MailService();

    async onSendUserAlert(req: Request, res: Response) {
        const allUserData = await this.alertSettingInteractor.getAllUserAlert();
        const allStatisticData = await this.statisticInteractor.getAllForecastAlert();

        const result = allUserData.map((user) => {
            const statisticData = allStatisticData[user.district_id];
            const data = { ...user, forecast: statisticData.forecast };
            const exceededDays = statisticData.forecast
                .filter((data) => data.aqi_index > 100)
                .flatMap((el) =>
                    new Date(el.time).toLocaleDateString("en-GB").split("/").join("-")
                );
            const aqiDays = statisticData.forecast.map((data) => ({
                ...data,
                time: new Date(data.time)
                    .toLocaleDateString("en-GB")
                    .split("/")
                    .splice(0, 2)
                    .join("-"),
            }));
            return {
                email: data.email,
                html: alertMailTemplate(
                    `${statisticData.vn_district}, ${statisticData.vn_province}`,
                    exceededDays,
                    aqiDays
                ),
            };
        });

        const emailPromises = result.map((alert) => {
            if (!alert.email) return null;

            return this.mailService.sendMail({
                to: alert.email,
                subject: "⚠️ Cảnh báo chất lượng không khí",
                html: alert.html,
            });
        });

        await Promise.all(emailPromises);

        return res.status(statusCode.SUCCESS).json({
            status: "success",
            data: true,
        });
    }

    async onCreateAlertSetting(req: Request, res: Response) {
        try {
            const alertSettingData = req.body;
            const alertSetting = await this.alertSettingInteractor.createAlertSetting(
                alertSettingData
            );

            return res.status(statusCode.CREATED).json({
                status: "success",
                data: alertSetting,
            });
        } catch (error) {
            console.error("Error creating alert setting:", error);
            return res.status(statusCode.ERROR).json({
                status: "error",
                message: resMessage.server_error,
                error,
            });
        }
    }

    async onUpdateAlertSetting(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const alertSettingData = req.body;

            const updatedAlertSetting = await this.alertSettingInteractor.updateAlertSetting(
                Number(id),
                alertSettingData
            );

            if (!updatedAlertSetting) {
                return res.status(statusCode.ERROR).json({
                    status: "fail",
                    message: resMessage.db_failed,
                });
            }

            res.status(statusCode.SUCCESS).json({
                status: "success",
                data: updatedAlertSetting,
            });
        } catch (error) {
            console.error("Error updating alert setting:", error);
            return res.status(statusCode.ERROR).json({
                status: "error",
                message: resMessage.db_failed,
                error: error,
            });
        }
    }

    async onDeleteAlertSettingById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const result = await this.alertSettingInteractor.deleteAlertSettingById(Number(id));

            if (!result) {
                return res.status(statusCode.NOT_FOUND).json({
                    status: "fail",
                    message: resMessage.db_failed,
                });
            }

            return res.status(statusCode.SUCCESS).json({
                status: "success",
                data: null,
            });
        } catch (error) {
            console.error("Error deleting alert setting:", error);
            return res.status(statusCode.ERROR).json({
                status: "error",
                message: resMessage.db_failed,
                error: error,
            });
        }
    }

    async onGetAlertSettingByUser(req: Request, res: Response) {
        try {
            const { user_id } = req.params;

            const alertSetting = await this.alertSettingInteractor.getAlertSettingByUserId(
                Number(user_id)
            );

            return res.status(statusCode.SUCCESS).json({
                status: "success",
                data: alertSetting,
            });
        } catch (error) {
            console.error("Error getting alert setting(s):", error);
            return res.status(statusCode.ERROR).json({
                status: "error",
                message: resMessage.db_failed,
                error: error,
            });
        }
    }

    onGetUserAlertByDistrict = async (req: Request, res: Response) => {
        const { district_id } = req.query;

        const setting = await this.alertSettingInteractor.getUserAlertByDistrict(
            district_id as string
        );
        const API_KEY = process.env.OPEN_WEATHER_MAP_API_KEY;

        const geocodingAPI = await axios.get(`http://api.openweathermap.org/geo/1.0/direct`, {
            params: {
                q: `${setting?.vn_province},VN`,
                appid: API_KEY,
                limit: 1,
            },
        });

        const openWeatherData = await axios.get<OpenWeatherForecastDataType>(
            `http://api.openweathermap.org/data/2.5/forecast/daily`,
            {
                params: {
                    lat: geocodingAPI.data[0].lat,
                    lon: geocodingAPI.data[0].lon,
                    cnt: 8,
                    appid: API_KEY,
                    units: "metric",
                    lang: "vi",
                },
            }
        );
        const dates: Date[] = [];
        const result = openWeatherData.data.list.map((data) => {
            const date = new Date(data.dt * 1000);
            dates.push(new Date(date.setHours(7, 0, 0, 0)));
            return {
                id: setting?.id,
                aqi_index: setting?.aqi_index || null,
                temperature: setting?.temperature
                    ? {
                          max: Math.round(data.temp.max),
                          min: Math.round(data.temp.min),
                          avg: Math.round((data.temp.max + data.temp.min) / 2),
                      }
                    : undefined,
                weather: data.weather[0].main,
                wind_speed: setting?.wind_speed ? data.speed : null,
                date: new Date(data.dt * 1000),
                location: `${setting?.vn_district}, ${setting?.vn_province}`,
            };
        });

        const forecast = await this.statisticInteractor.getDistrictHistory(
            district_id as string,
            dates[0],
            dates[7]
        );

        const openWeatherCurrentData = await axios.get<OpenWeatherCurrentDataType>(
            `https://api.openweathermap.org/data/2.5/weather`,
            {
                params: {
                    lat: geocodingAPI.data[0].lat,
                    lon: geocodingAPI.data[0].lon,
                    appid: API_KEY,
                    units: "metric",
                    lang: "vi",
                },
            }
        );

        const currentWeather = {
            temperature: {
                max: Math.round(openWeatherCurrentData.data.main.temp_max),
                min: Math.round(openWeatherCurrentData.data.main.temp_min),
                avg: Math.round(openWeatherCurrentData.data.main.temp),
            },
            weather: openWeatherCurrentData.data.weather[0].main,
            wind_speed: openWeatherCurrentData.data.wind.speed,
            // date: new Date(openWeatherCurrentData.data.dt * 1000),
        };
        result[0] = { ...result[0], ...currentWeather };
        return res.status(statusCode.SUCCESS).json({
            status: "success",
            data: { weather: result, forecast: forecast?.flatMap((body) => body.aqi_index) || [] },
        });
    };

    onGetWeatherDataByLocation = async (req: Request, res: Response) => {
        const { district_id, lat, lon } = req.query;

        const payload = { lat: 0, lon: 0, location: "" };
        const API_KEY = process.env.OPEN_WEATHER_MAP_API_KEY;

        if (district_id) {
            const district = await this.districtInteractor.findDistrict(district_id as string);
            const geocodingAPI = await axios.get(`http://api.openweathermap.org/geo/1.0/direct`, {
                params: {
                    q: `${district?.vn_province},VN`,
                    appid: API_KEY,
                    limit: 1,
                },
            });
            payload.lat = geocodingAPI.data[0].lat;
            payload.lon = geocodingAPI.data[0].lon;
        } else {
            payload.lat = Number(lat);
            payload.lon = Number(lon);
        }
        const openWeatherCurrentData = await axios.get<OpenWeatherCurrentDataType>(
            `https://api.openweathermap.org/data/2.5/weather`,
            {
                params: {
                    lat: payload.lat,
                    lon: payload.lon,
                    appid: API_KEY,
                    units: "metric",
                    lang: "vi",
                },
            }
        );
        console.log(openWeatherCurrentData.data);
        const result = {
            temperature: {
                max: Math.round(openWeatherCurrentData.data.main.temp_max),
                min: Math.round(openWeatherCurrentData.data.main.temp_min),
                avg: Math.round(openWeatherCurrentData.data.main.temp),
            },
            weather: openWeatherCurrentData.data.weather[0],
            wind_speed: openWeatherCurrentData.data.wind.speed,
            date: new Date(openWeatherCurrentData.data.dt * 1000),
        };

        return res.status(statusCode.SUCCESS).json({
            status: "success",
            data: result,
        });
    };
}
