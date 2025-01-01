import { IStorageService } from "@/interfaces/services/IStorageService";
import { GetObjectCommand, S3Client, S3ClientConfig } from "@aws-sdk/client-s3";

export class StorageService implements IStorageService {
  private readonly s3Client: S3Client;
  constructor() {
    this.s3Client = new S3Client({
      region: "ap-southeast-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_KEY_ID,
      },
    } as S3ClientConfig);
  }
  async getObject(path: string): Promise<ReadableStream | null> {
    try {
      const { Body } = await this.s3Client.send(
        new GetObjectCommand({
          Bucket: "uet-airq",
          Key: path,
        })
      );

      return Body?.transformToWebStream() ?? null;
    } catch (error) {
      console.log("Error get file from AWS S3", error);
      return null;
    }
  }
}
