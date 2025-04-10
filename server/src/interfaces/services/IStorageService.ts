export interface IStorageService {
    getObject(path: string): Promise<string | null>;
    putObject(path: string, data: Express.Multer.File): Promise<any>;
    deleteObject(path: string): Promise<any>;
}
