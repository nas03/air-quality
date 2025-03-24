export class CronjobMonitor {
  constructor(
    public id: number,
    public raster_data_status: number,
    public raster_data_timestamp: Date,
    public wind_data_status: number,
    public wind_data_timestamp: Date,
    public station_data_status: number,
    public station_data_timestamp: Date,
    public timestamp: Date
  ) {}
}
