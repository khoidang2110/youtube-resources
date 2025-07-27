# 🚀 Hướng Dẫn Chạy Traefik Trên Ubuntu

Tự thiết lập reverse proxy với HTTPS tự động bằng Let's Encrypt & Traefik 🚀

---

## 🧰 Bước 1: Tạo thư mục và file cấu hình

```bash
cd /home/root
mkdir traefik
cd traefik
nano traefik.yml
```
## 📄 Bước 2: Nội dung file traefik.yml
```bash
entryPoints:
  http:
    address: ":80"
  https:
    address: ":443"

api:
  dashboard: true
  insecure: true

certificatesResolvers:
  letsencrypt:
    acme:
      email: khoidang2110@gmail.com  # Thay bằng email của bạn
      storage: acme.json
      httpChallenge:
        entryPoint: http

providers:
  docker:
    network: traefik
    exposedByDefault: false
```
## 🐳 Bước 3: Tạo file docker-compose.yml
```bash
version: '3'

services:
  reverse-proxy:
    image: traefik:v2.11
    command: --configFile=/etc/traefik/traefik.yml
    ports:
      - "80:80"
      - "443:443"
      - "8080:8080"  # Dashboard
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./traefik.yml:/etc/traefik/traefik.yml
      - ./acme.json:/acme.json
    networks:
      - traefik
    restart: always

networks:
  traefik:
    external: true
```
## 🔐 Bước 4: Tạo file acme.json và phân quyền
```bash
 touch acme.json
 chmod 600 acme.json
```
## 🌐 Bước 5: Tạo Docker network traefik
```bash
docker network create traefik
```
## 🚀 Bước 6: Khởi động Traefik
```bash
docker-compose up -d
```


