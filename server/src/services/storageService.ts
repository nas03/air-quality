import { IStorageService } from "@/interfaces/services/IStorageService";
import {
    DeleteObjectCommand,
    GetObjectCommand,
    ListObjectsCommand,
    ListObjectsCommandInput,
    PutObjectCommand,
    S3Client,
    S3ClientConfig,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import JSZip from "jszip";

export class StorageService implements IStorageService {
    private readonly s3Client: S3Client;
    private readonly s3Bucket: string;
    constructor() {
        this.s3Client = new S3Client({
            region: "ap-southeast-1",
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_KEY_ID,
            },
        } as S3ClientConfig);
        this.s3Bucket = process.env.AWS_BUCKET as string;
    }

    getObject = async (objectPath: string): Promise<string | null> => {
        try {
            const command = new GetObjectCommand({
                Bucket: this.s3Bucket,
                Key: objectPath,
            });
            const signedURL = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
            return signedURL ?? null;
        } catch (error) {
            console.log("Error get file from AWS S3", error);
            return null;
        }
    };

    putObject = async (objectPath: string, data: Express.Multer.File) => {
        try {
            if (!data || !data.buffer) {
                throw new Error("Invalid file data");
            }

            const command = new PutObjectCommand({
                Bucket: this.s3Bucket,
                Key: objectPath,
                Body: data.buffer,
                ContentType: data.mimetype,
                ContentLength: data.size,
            });

            const response = await this.s3Client.send(command);
            const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });

            return {
                success: true,
                url,
                etag: response.ETag,
                key: objectPath,
            };
        } catch (error) {
            console.error("Error uploading file to AWS S3:", error);
            throw error;
        }
    };

    deleteObject = async (objectPath: string) => {
        try {
            const command = new DeleteObjectCommand({
                Bucket: this.s3Bucket,
                Key: objectPath,
            });

            const response = await this.s3Client.send(command);

            return {
                success: true,
                key: objectPath,
                deleteMarker: response.DeleteMarker,
            };
        } catch (error) {
            console.error("Error deleting file from AWS S3:", error);
            throw error;
        }
    };

    listObjects = async (options: Omit<ListObjectsCommandInput, "Bucket">) => {
        const listObjectsCommand = new ListObjectsCommand({
            ...options,
            Bucket: this.s3Bucket,
        });

        const response = await this.s3Client.send(listObjectsCommand);
        return response;
    };

    getMultipleObjects = async (objectPaths: string[], zip: JSZip): Promise<JSZip> => {
        try {
            // Download each file and add it to the zip
            const downloadPromises = objectPaths.map(async (path) => {
                try {
                    const command = new GetObjectCommand({
                        Bucket: this.s3Bucket,
                        Key: path,
                    });

                    const response = await this.s3Client.send(command);
                    if (!response.Body) {
                        console.warn(`Empty body for file: ${path}`);
                        return;
                    }

                    // Convert the stream to buffer
                    const chunks: Uint8Array[] = [];
                    for await (const chunk of response.Body as any) {
                        chunks.push(chunk);
                    }
                    const buffer = Buffer.concat(chunks);

                    const [year, month, fileName] = path.split("/");
                    zip.folder("raster_data")?.folder(year)?.folder(month)?.file(fileName, buffer);

                    console.log(`Added file ${fileName} to zip archive`);
                } catch (error) {
                    console.error(`Error downloading file ${path}:`, error);
                }
            });

            await Promise.all(downloadPromises);
            return zip;
        } catch (error) {
            console.error("Error creating zip archive:", error);
            throw error;
        }
    };
}
