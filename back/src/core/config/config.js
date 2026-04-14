import 'dotenv/config'

export const db = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
};

export const minio = {
  HOST: process.env.MINIO_HOST,
  ENDPOINT: process.env.MINIO_ENDPOINT,
  ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
  SECRET_KEY: process.env.MINIO_SECRET_KEY,
  BUCKET: process.env.BUCKET,
}