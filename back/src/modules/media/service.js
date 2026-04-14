import minioClient from '../../core/minio/minio.conn.js'
import { minio } from '../../core/config/config.js'

export class FileService {
  // constructor(client, bucket) {
  //   this.client = client
  //   this.bucket = bucket
  // } 

  async savefile(buffer, originalname, mimetype) {
    const exists = minioClient.bucketExists(minio.BUCKET)
    if (!exists) throw new Error('[MINIO] Bucket no existe')

    minioClient.putObject(minio.BUCKET, originalname, buffer, function (err, objInfo) {
      if (err) {
        throw new Error(err)
      }
      console.log('Success', objInfo)
      return objInfo
    })
  }
}