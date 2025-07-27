✅ BƯỚC 1: Cài các công cụ cần thiết
```bash
sudo apt update
sudo apt install -y docker.io docker-compose curl tar
```
✅ BƯỚC 2: Tạo thư mục riêng để chứa Harbor
```bash
cd /home/khoi
mkdir harbor-standalone
cd harbor-standalone
```
✅ BƯỚC 3: Tải Harbor Installer
```bash
curl -LO https://github.com/goharbor/harbor/releases/download/v2.11.0/harbor-online-installer-v2.11.0.tgz
tar xzvf harbor-online-installer-v2.11.0.tgz
cd harbor
```
✅ BƯỚC 4: Cấu hình harbor.yml (⚠️ KHÔNG bật nginx)
Chỉnh sửa file:

```bash
cp harbor.yml.tmpl harbor.yml
nano harbor.yml
```
Thay đổi nội dung như sau:

```bash
hostname: harbor.tichluyvang.com

http:
  port: 8080  # Dùng cổng nội bộ để tránh đụng NPM

# ❌ KHÔNG cấu hình HTTPS ở đây
# https:
#   port: 443
#   certificate: /your/certificate/path
#   private_key: /your/private/key/path

harbor_admin_password: Harbor12345

database:
  password: root123

data_volume: /data

log:
  level: info
  local:
    rotate_count: 50
    rotate_size: 200M
    location: /var/log/harbor
```
✅ BƯỚC 5: Cài đặt Harbor
Chạy lệnh:
```bash
sudo ./install.sh
Sau khi cài thành công, Harbor sẽ chạy tại http://your-vps-ip:8080
```
✅ BƯỚC 6: Cấu hình Nginx Proxy Manager (NPM)
```bash
Vào NPM và tạo 1 Proxy Host:

Trường	Giá trị
Domain Name	harbor.tichluyvang.com
Forward Hostname/IP	127.0.0.1 hoặc địa chỉ IP VPS
Forward Port	8080
Scheme	http
SSL	Bật “Force SSL” + “HTTP/2” + chọn “Request a new SSL Certificate” với Let’s Encrypt
```
✅ BƯỚC 7: Truy cập Harbor qua domain
Mở trình duyệt và vào:
👉 https://harbor.tichluyvang.com

Login bằng:

Username: admin

Password: Harbor12345

