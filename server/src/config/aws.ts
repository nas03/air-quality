import { GetObjectCommand, PutObjectCommand, S3Client, S3ClientConfig } from "@aws-sdk/client-s3";

const config: S3ClientConfig = {
  region: "auto",
  credentials: {
    accessKeyId: String(process.env.ACCESS_KEY_ID),
    secretAccessKey: String(process.env.SECRET_KEY_ID),
  },
};
const s3Client = new S3Client(config);

const getObject = async (path: string) => {
  try {
    const getObjectCommand = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: path,
    });
    const object = await s3Client.send(getObjectCommand);
    return object;
  } catch (error) {
    console.log("Error fetching object from AWS S3", error);
    return null;
  }
};

const putObject = async (filename: string, path: string, file: Blob) => {
  try {
    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: `${path}/${filename}`,
      Body: file,
    });
    const object = await s3Client.send(putObjectCommand);
    return object;
  } catch (error) {
    console.log("Error uploading file to AWS", error);
    return null;
  }
};

export { getObject, putObject };
