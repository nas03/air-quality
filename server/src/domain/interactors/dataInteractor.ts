import { IDataInteractor } from "@/interfaces/interactors/IDataInteractor";
import { StorageService } from "@/services/storageService";

export class DataInteractor implements IDataInteractor {
  private readonly storageService: StorageService;

  constructor() {
    this.storageService = new StorageService();
  }

  async getImage(path: string) {
    const data = await this.storageService.getObject("PM25_20241101_3kmNRT.tif");
    return data;
  }
}
