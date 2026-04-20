# Infrastructure Setup

## Quick Start

```bash
# Start all external services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## Services

| Service | Port | URL | Credentials |
|---------|------|-----|--------------|
| PostgreSQL | 5432 | - | `echoknight` / `echoknight_secure_pass` |
| RabbitMQ | 5672, 15672 | http://localhost:15672 | `echoknight` / `echoknight_secure_pass` |
| Redis | 6379 | - | `echoknight_secure_pass` |
| MinIO (API) | 9000 | http://localhost:9000 | `echoknight` / `echoknight_secure_pass` |
| MinIO (Console) | 9001 | http://localhost:9001 | `echoknight` / `echoknight_secure_pass` |
| Adminer (DB UI) | 8080 | http://localhost:8080 | - |

## MinIO Setup (One-time)

After starting MinIO, create the bucket:

```bash
# Using mc CLI (install first)
mc alias set local http://localhost:9000 echoknight echoknight_secure_pass
mc mb local/echoknight-files
mc anonymous set download local/echoknight-files
```

Or via the Console (http://localhost:9001):
1. Login with credentials
2. Create bucket: `echoknight-files`
3. Set bucket policy to public/read for testing

## Health Checks

```bash
# PostgreSQL
docker exec cryptex-postgres pg_isready -U echoknight

# RabbitMQ
docker exec cryptex-rabbitmq rabbitmq-diagnostics check_running

# Redis
docker exec cryptex-redis redis-cli -a echoknight_secure_pass ping

# MinIO
curl http://localhost:9000/minio/health/live
```

## Troubleshooting

```bash
# View service logs
docker-compose logs postgres
docker-compose logs rabbitmq
docker-compose logs redis
docker-compose logs minio

# Reset data (stop first)
docker-compose down -v
docker-compose up -d
```
