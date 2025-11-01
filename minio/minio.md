```bash
docker run -d --name minio \
  -p 8001:9000 \
  -p 8002:9001 \
  -e "MINIO_ROOT_USER=admin" \
  -e "MINIO_ROOT_PASSWORD=admin" \
  -v /home/minio/data:/data \
  minio/minio server /data --console-address ":9001"
```