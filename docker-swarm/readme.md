# 🚀 Dự án Node.js test Docker Swarm
Đây là một ứng dụng Node.js đơn giản dùng để kiểm thử triển khai với Docker Swarm.

# 🐳 Các bước chạy test với Docker Swarm
## 1. Khởi tạo Docker Swarm (nếu chưa có)
```bash
docker swarm init
```
## 2. Build Docker image
```bash
docker build -t my-node-app:latest .
```
## 3. Triển khai ứng dụng với Docker Stack
```bash
docker stack deploy -c docker-compose.yml my_app
```
