import { IStorageService } from "@/interfaces/services/IStorageService";
import {
    DeleteObjectCommand,
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
    S3ClientConfig,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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
            const signedURL = await getSignedUrl(this.s3Client, command);
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
}
