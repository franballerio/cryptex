import { minioConn } from "../../core/minio/minio.conn"

export class FileRepository {
  constructor(client) {
    this.client = client
  }
}