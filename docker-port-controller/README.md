# Cách mở và tắt port vào DB

Chào các bạn, mình là Khôi.
Dù bạn đặt password DB có khó và dài đến đâu, nhưng nếu mở port ra ngoài thì mỗi giây bạn vẫn đang bị dò mật khẩu liên tục.

## Hôm nay mình sẽ hướng dẫn các bước:

- Mở port để kiểm tra DB bằng TablePlus

- Sau đó đóng lại để tránh brute-force

- Nhưng vẫn giữ nguyên dữ liệu và server API vẫn gọi đến DB trong cùng Docker network

## Bước 1: Cài DB PostgreSQL

Mình dùng PostgreSQL. Trước tiên, tạo Docker network:

docker network create pg-express

Sau đó chạy container DB như sau:
```bash
docker run -d
--name postgres_db
-e POSTGRES_PASSWORD=1234
--restart=always
-v demopgdata:/var/lib/postgresql/data
--network pg-express
-p 8001:5432
--cpus=0.5 --memory=0.5g
postgres:16.4
```
### Lưu ý: cần tạo trước volume demopgdata và network pg-express.

- Do lệnh trên có mở port, nên mình có thể kết nối DB bằng TablePlus từ máy cá nhân với địa chỉ:
john2110.ddns.net:8001

## Bước 2: Cài server API kết nối DB

- Mình dùng một repo Express có sẵn, clone về:
```bash
git clone https://github.com/khoidang2110/express-product.git
```

- Sau đó chạy lên:
```bash
docker compose up -d --build
```
- Truy cập API tại:
```bash
http://john2110.ddns.net:8002/products
```
- Lúc này API đã truy cập được DB, đồng thời mình vẫn có thể dùng TablePlus để kiểm tra.

## Bước 3: Tắt port DB nhưng vẫn giữ API hoạt động

- Để an toàn, giờ mình sẽ xoá container DB:
```bash
docker rm -f postgres_db
```
- Sau đó tạo lại container nhưng không mở port ra ngoài (không có -p):

```bash
docker run -d
--name postgres_db
-e POSTGRES_PASSWORD=1234
--restart=always
-v demopgdata:/var/lib/postgresql/data
--network pg-express
--cpus=0.5 --memory=0.5g
postgres:16.4
```
- Vì dùng volume nên dữ liệu vẫn còn.
- Giờ TablePlus không còn truy cập từ ngoài được nữa (đã đóng port), nhưng server API vẫn hoạt động vì đang nằm trong cùng Docker network.

## Kết luận:

- Khi cần test thì mở port để kiểm tra bằng TablePlus.

- Khi chạy thật, tắt port để tránh bị scan/dò password.

- API vẫn hoạt động ổn định nhờ dùng Docker network nội bộ.

- Dữ liệu không bị mất do đã lưu trong volume.

