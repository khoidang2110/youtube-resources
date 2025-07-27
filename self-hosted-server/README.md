# 🏡 Tự host server tại nhà bằng Ubuntu & deploy frontend
Đây là hướng dẫn từng bước để tự tạo một server Ubuntu tại nhà, cấu hình domain, mở port, và thử chạy một website frontend (React/Next.js) thông qua Docker.

# ✨ Mục tiêu
```bash
Cài đặt và thiết lập Ubuntu server trên máy tính mini (hoặc PC cũ)

Cấu hình Dynamic DNS (No-IP) để có domain dù IP mạng là động

Mở port để truy cập từ xa qua SSH (port 2222)

Deploy thử một website frontend với Docker + Nginx Proxy Manager
```
# 🧩 Các bước thực hiện
## ✅ Bước 1: Kiểm tra IP mạng nhà bạn
```bash
Truy cập modem (ở đây là FPT) để xem IP WAN (VD: 42.119.12.4)

Vào ping.eu > mục Your IP → kiểm tra IP đó có trùng không

Nếu không trùng, tức là bạn đang dùng NAT, cần gọi tổng đài FPT để nhờ hỗ trợ mở truy cập ngoài.

Lưu ý: IP FPT thường là IP động – reset modem sẽ đổi IP.
```
## ✅ Bước 2: Thiết lập Dynamic DNS với No-IP
```bash
Mục đích: Có domain trỏ về IP động, dù IP thay đổi vẫn truy cập được.

Đăng ký tài khoản tại https://www.noip.com

Tạo host (VD: john2110.ddns.net)

Truy cập trang cấu hình modem FPT > mục Dynamic DNS:

Nhập username, password (hoặc access key), hostname
```
## ✅ Bước 3: Cài đặt Ubuntu server trên máy tính
```bash
Dùng USB boot Ubuntu Server và cài đặt bình thường

Thiết lập user + password

Cài đặt wifi nếu không có cổng LAN (dùng card WiFi onboard)
```
🧾 Cấu hình mạng (VD: /etc/netplan/01-netcfg.yaml):

```bash
network:
  version: 2
  renderer: networkd
  wifis:
    wlp2s0:
      optional: true
      access-points:
        "TEN_WIFI_CUA_BAN":
          password: "MAT_KHAU_WIFI"
      dhcp4: no
      addresses: [192.168.1.42/24]
      gateway4: 192.168.1.1
      nameservers:
        addresses: [8.8.8.8, 1.1.1.1]
```
Lưu file, chạy sudo netplan apply

Dùng lệnh "ip a" để xem card mạng: wlp2s0, enp9s31f6, v.v.

Mở port 2222 trên firewall (nếu có): sudo ufw allow 2222

## ✅ Bước 4: SSH vào server từ máy khác
```bash

ssh -p 2222 khoi@192.168.1.42         # Trong cùng mạng LAN
ssh -p 2222 khoi@john2110.ddns.net    # Từ mạng khác
```
📱 Gợi ý dùng Termius để quản lý kết nối dễ dàng hơn.

## ✅ Bước 5: Gán subdomain cho domain động
Mua domain chính (VD: tichluyvang.com)

Trỏ subdomain (VD: home.tichluyvang.com) về domain No-IP:
```bash
Type: CNAME
Name: home
Value: john2110.ddns.net
```
## ✅ Bước 6: Cài đặt Nginx Proxy Manager
Dùng để map domain/subdomain vào container đang chạy

Cài đặt Nginx Proxy Manager bằng Docker (xem thêm tại nginxproxymanager.com)

Tạo Proxy Host:

Domain: home.tichluyvang.com

IP: 192.168.1.42

Port: 3000

Bật SSL (Let's Encrypt)

## ✅ Bước 7: Mở port trong modem (FPT)
Truy cập modem FPT > Mục Port Forwarding

Mở port: 2222 (SSH), 3000 (frontend)

IP: 192.168.1.42 (local IP của máy Ubuntu)

## ✅ Bước 8: Deploy website frontend
Clone source tại GitHub:
👉 https://github.com/khoidang2110/underconstruction.git

Chạy lệnh:
```bash
git clone https://github.com/khoidang2110/underconstruction.git
cd underconstruction
docker compose up -d
```
Đảm bảo file docker-compose.yml dùng port 3000

Truy cập: https://home.tichluyvang.com

# 📝 Tổng kết
## Hạng mục	Đã thực hiện
🖥️ Ubuntu Server	✅
🌐 Dynamic DNS	✅
🔐 SSH từ xa	✅
🌍 Subdomain	✅
🧱 Docker & Nginx Proxy	✅
🚀 Deploy FE	✅

# 📺 Video hướng dẫn
Link video YouTube: https://www.youtube.com/watch?v=7f3DUFW_HRo
Cảm ơn bạn đã theo dõi! Nếu thấy hữu ích, hãy ⭐️ repo nhé!

