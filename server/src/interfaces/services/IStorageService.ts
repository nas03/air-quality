export interface IStorageService {
	getObject(path: string): Promise<string | null>;

	putObject(
		path: string,
		data: Express.Multer.File,
	): Promise<{
		success: boolean;
		url: string;
		etag: string | undefined;
		key: string;
	}>;

	deleteObject(path: string): Promise<{
		success: boolean;
		key: string;
		deleteMarker: boolean | undefined;
	}>;
}
