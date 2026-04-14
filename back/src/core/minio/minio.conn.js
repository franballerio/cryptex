import { minio } from "../config/config";
import { Minio } from 'minio';

export const minioClient = new Minio.Client({
  accessKey: minio.ACCESS_KEY,
  secretKey: minio.SECRET_KEY,
  endPoint: minio.ENDPOINT,
  pathStyle: true,
})


