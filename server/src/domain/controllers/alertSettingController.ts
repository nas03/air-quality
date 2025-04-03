import { resMessage, statusCode } from "@/config/constant";
import axios from "axios";
import dotenv from "dotenv";
import { Request, Response } from "express";
import { DistrictInteractor, StatisticInteractor } from "../interactors";
import { AlertSettingInteractor } from "../interactors/alertSettingInteractor";
import { BaseController } from "./baseController";
import { OpenWeatherDataType } from "./types";
dotenv.config();

export class AlertSettingController extends BaseController<
  [AlertSettingInteractor, DistrictInteractor, StatisticInteractor]
> {
  private alertSettingInteractor = this.interactors[0];
  private districtInteractor = this.interactors[1];
  private statisticInteractor = this.interactors[2];
  async onCreateAlertSetting(req: Request, res: Response) {
    try {
      const alertSettingData = req.body;
      const alertSetting = await this.alertSettingInteractor.createAlertSetting(alertSettingData);

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

      if (!user_id) {
        return res.status(statusCode.BAD_REQUEST).json({
          status: "fail",
          message: resMessage.field_invalid,
          data: null,
        });
      }
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
    const { user_id } = req.params;
    const { district_id } = req.query;

    if (!user_id || !district_id) {
      return res.status(statusCode.BAD_REQUEST).json({
        status: "fail",
        message: resMessage.field_invalid,
        data: null,
      });
    }

    const setting = await this.alertSettingInteractor.getUserAlertByDistrict(district_id as string);
    const API_KEY = process.env.OPEN_WEATHER_MAP_API_KEY;
    console.log(setting);
    const geocodingAPI = await axios.get(`http://api.openweathermap.org/geo/1.0/direct`, {
      params: {
        q: `${setting?.vn_province},VN`,
        appid: API_KEY,
        limit: 1,
      },
    });

    const openWeatherData = await axios.get<OpenWeatherDataType>(
      `http://api.openweathermap.org/data/2.5/forecast/daily`,
      {
        params: {
          lat: geocodingAPI.data[0].lat,
          lon: geocodingAPI.data[0].lon,
          cnt: 8,
          appid: API_KEY,
          units: "metric",
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
    return res.status(statusCode.SUCCESS).json({
      status: "success",
      data: { weather: result, forecast: forecast?.flatMap((body) => body.aqi_index) || [] },
    });
  };

  onGetWeatherDataByLocation = async (req: Request, res: Response) => {
    const { district_id, lat, lon } = req.query;

    if (!district_id && (!lat || !lon)) {
      return res.status(statusCode.BAD_REQUEST).json({
        status: "fail",
        message: resMessage.field_invalid,
        data: null,
      });
    }
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
    const openWeatherData = await axios.get<OpenWeatherDataType>(
      `http://api.openweathermap.org/data/2.5/forecast/daily`,
      {
        params: {
          lat: payload.lat,
          lon: payload.lon,
          cnt: 1,
          appid: API_KEY,
          units: "metric",
        },
      }
    );

    const result = openWeatherData.data.list.map((data) => {
      return {
        temperature: {
          max: Math.round(data.temp.max),
          min: Math.round(data.temp.min),
          avg: Math.round((data.temp.max + data.temp.min) / 2),
        },
        weather: data.weather[0].main,
        wind_speed: data.speed,
        date: new Date(data.dt * 1000),
      };
    });

    return res.status(statusCode.SUCCESS).json({
      status: "success",
      data: result[0],
    });
  };
}
