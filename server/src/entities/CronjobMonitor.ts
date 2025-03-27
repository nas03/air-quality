export class CronjobMonitor {
  constructor(
    public id: number,
    public raster_data_status: number,
    public wind_data_status: number,
    public station_data_status: number,
    public wind_data_log: string,
    public station_data_log: string,
    public timestamp: Date
  ) {}
}
