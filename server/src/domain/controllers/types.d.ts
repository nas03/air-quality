export type UserToken = {
    user_id: number;
    username: string;
    role?: string;
};

/* export interface OpenWeatherDataType {
  status: string;
  data: Data;
} */

export interface OpenWeatherForecastDataType {
    city: City;
    cod: string;
    message: number;
    cnt: number;
    list: List[];
}

export interface List {
    dt: number;
    sunrise: number;
    sunset: number;
    temp: Temp;
    feels_like: Feelslike;
    pressure: number;
    humidity: number;
    weather: Weather[];
    speed: number;
    deg: number;
    gust: number;
    clouds: number;
    pop: number;
    rain?: number;
}

export interface Weather {
    id: number;
    main: string;
    description: string;
    icon: string;
}

export interface Feelslike {
    day: number;
    night: number;
    eve: number;
    morn: number;
}

export interface Temp {
    day: number;
    min: number;
    max: number;
    night: number;
    eve: number;
    morn: number;
}

export interface City {
    id: number;
    name: string;
    coord: Coord;
    country: string;
    population: number;
    timezone: number;
}

export interface Coord {
    lon: number;
    lat: number;
}

export interface OpenWeatherCurrentDataType {
    coord: Coord;
    weather: Weather[];
    base: string;
    main: Main;
    visibility: number;
    wind: Wind;
    clouds: Clouds;
    dt: number;
    sys: Sys;
    timezone: number;
    id: number;
    name: string;
    cod: number;
}

export interface Main {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
}

export interface Wind {
    speed: number;
    deg: number;
    gust?: number;
}

export interface Clouds {
    all: number;
}

export interface Sys {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
}
