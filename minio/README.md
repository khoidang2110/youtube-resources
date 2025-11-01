Bước 1. Cài curl (nếu chưa có)
```bash
    sudo apt update
    sudo apt install -y curl
```
Bước 2. Tải và cài MinIO Client (mc)
```bash
    curl -fL --insecure https://dl.min.io/client/mc/release/linux-amd64/mc -o mc
    chmod +x mc
    sudo mv mc /usr/local/bin/mc
```
Bước 3. Kiểm tra cài đặt
```bash
    mc --version    
```
Bước 4. Tạo alias kết nối MinIO (dùng localhost trên máy Ubuntu chạy MinIO)
```bash
    mc alias set myminio http://localhost:8001 admin admin
```
Bước 5.  (Tuỳ) Tạo bucket nếu chưa có
```bash
    mc mb -p myminio/web || true
```
Bước 6.  Mở quyền public-read cho bucket web
```bash
    mc anonymous set download myminio/web
```
---> Access permission for `myminio/web` is set to `download`

Bước 7.  chép folder repo mới clone về
```bash
    mc cp -r ./samar/* myminio/web/samar/
```
Bước 8. truy cập: http://john2110.ddns.net:8001/web/samar/index.html

Bước 9. cập nhật code file tĩnh: 
```bash
    mc mirror --overwrite --remove ./ myminio/web/samar
```   
Giải thích:

--overwrite → ghi đè file cũ

--remove → xóa file nào bị xoá trong git

./ → thư mục hiện tại (nơi có index.html)

myminio/web/samar → nơi bạn đã deploy

mc rb myminio/web → xoá bucket trống
