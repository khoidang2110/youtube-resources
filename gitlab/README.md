# HƯỚNG DẪN TỰ HOST GITLAB VÀ CHẠY GITLAB CI

## TỔNG QUAN
Hướng dẫn này sẽ giúp bạn:
- Cài đặt GitLab trên VPS 1
- Cấu hình GitLab CI/CD 
- Kết nối với VPS 2 để deploy tự động

## CHUẨN BỊ
- **VPS 1**: `john2110.ddns.net` (GitLab Server)
- **VPS 2**: `14.225.220.181` (Deployment Server)
- Docker đã được cài đặt trên VPS 1
- GitLab Runner đã được cài đặt trên VPS 2

## I. CÀI ĐẶT GITLAB TRÊN VPS 1

### 1. Khởi động GitLab Container
```bash
# Tải và chạy GitLab (image khá nặng, cài đặt mất thời gian)
docker run --detach \
  --hostname john2110.ddns.net \
  --publish 8003:80 \
  --publish 8004:22 \
  --name gitlab \
  --restart always \
  --volume gitlab_config:/etc/gitlab \
  --volume gitlab_logs:/var/log/gitlab \
  --volume gitlab_data:/var/opt/gitlab \
  gitlab/gitlab-ce:latest
```

### 2. Lấy mật khẩu root
```bash
# Chờ GitLab khởi động hoàn tất (có thể mất 5-10 phút)
# Nếu thấy status "starting" có nghĩa là đang khởi động
docker exec -it gitlab cat /etc/gitlab/initial_root_password
```

**Thông tin đăng nhập:**
- Username: `root`
- Password: `wHF8ciNEkC7w0h42Xletsobf5zNQagjUA61OL+lQtOs=`
- URL: `http://john2110.ddns.net:8003`

## II. TẠO TÀI KHOẢN VÀ PROJECT

### 1. Tạo user mới
- Đăng nhập với tài khoản root
- Vào Admin Area → Users → New User
- Tạo user: `john`

### 2. Tạo project mới
- Đăng nhập bằng tài khoản `john`
- New Project → Create blank project
- Project name: `masterworkgitlab`

## III. PUSH CODE LÊN GITLAB

### Source Code Mẫu
Sử dụng project frontend: [masterwork](https://github.com/khoidang2110/masterwork.git)

```bash
# Clone source code
git clone https://github.com/khoidang2110/masterwork.git
cd masterwork

# Cấu hình remote GitLab
git remote remove origin  # Xóa remote cũ nếu có
git remote add origin ssh://git@john2110.ddns.net:8004/john/masterworkgitlab.git

# Push code lên GitLab
git push -u origin main
```

## IV. TẠO SSH KEY ĐỂ KẾT NỐI VPS2

### 1. Tạo SSH key trên máy local
```bash
# Tạo SSH key pair
ssh-keygen -t ed25519 -f ~/.ssh/gitlab_ci -C "gitlab-ci" -N ""
```

### 2. Copy public key vào VPS2
```bash
# Copy public key vào VPS2
ssh-copy-id -i ~/.ssh/gitlab_ci.pub root@14.225.220.181

# Kiểm tra kết nối
ssh -i ~/.ssh/gitlab_ci root@14.225.220.181
```

## V. CẤU HÌNH PRIVATE KEY TRONG GITLAB

### 1. Lấy private key
```bash
cat ~/.ssh/gitlab_ci
```

### 2. Thêm vào GitLab Variables
- Vào Project → Settings → CI/CD → Variables
- Click **Add Variable**:
  - **Key**: `PRIVATE_KEY`
  - **Value**: Nội dung của private key (từ lệnh `cat ~/.ssh/gitlab_ci`)
  - **Type**: Variable
  - **Protected**: ✓ (nếu chỉ chạy trên protected branches)
  - **Masked**: ✓ (để ẩn trong logs)

## VI. CẤU HÌNH GITLAB RUNNER TRÊN VPS2

### 1. Cài đặt GitLab Runner (nếu chưa có)
```bash
# Trên Ubuntu/Debian
curl -L "https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.deb.sh" | sudo bash
sudo apt-get install gitlab-runner
```

### 2. Register Runner
```bash
sudo gitlab-runner register \
  --url http://john2110.ddns.net:8003 \
  --token glrt-bZ6r_wsLJRdbktYQMc7WMW86MQpwOjEKdDozCnU6Mw8.01.170u6xwsx
```

**Cấu hình khi register:**
- **Executor**: `shell`
- **Description**: `VPS2 Deployment Runner`
- **Tags**: `deploy, vps2`

### 3. Quản lý Runner
```bash
# Dừng runner
sudo gitlab-runner stop

# Khởi động runner
sudo gitlab-runner start

# Kiểm tra status
sudo gitlab-runner status

# Xem danh sách runners
sudo gitlab-runner list
```

## VII. TẠO GITLAB CI/CD PIPELINE

### Tạo file `.gitlab-ci.yml`
```yaml
deploy-to-vps2:
  stage: deploy
  only:
    - main
  tags:
    - gitlabvps2
  script:
    - echo "🔐 Cấu hình SSH"
    - apt-get update -y && apt-get install -y openssh-client
    - eval $(ssh-agent -s)
    - echo "$gitlabvps2" | tr -d '\r' | ssh-add -
    - mkdir -p ~/.ssh
    - chmod 700 ~/.ssh
    - ssh-keyscan -p 22 14.225.220.181 >> ~/.ssh/known_hosts
    - chmod 644 ~/.ssh/known_hosts

    - echo "🚀 Triển khai ứng dụng..."
    - ssh -o StrictHostKeyChecking=no root@14.225.220.181 "
        echo '📁 Kiểm tra folder project' &&
        if [ ! -d /home/root/masterworkgitlab ]; then
          echo '📥 Chưa có project => clone' &&
          git clone http://john2110.ddns.net:8003/john/masterworkgitlab /home/root/masterworkgitlab;
        fi &&

        echo '📂 Di chuyển vào project' &&
        cd /home/root/masterworkgitlab &&

        echo '🔀 Checkout main và thiết lập tracking (nếu cần)' &&
        git checkout main || git checkout -b main origin/main &&
        git branch --set-upstream-to=origin/main main &&

        echo '🔄 Pull cập nhật' &&
        git reset --hard &&
        git pull &&

        echo '🛑 Dừng container cũ (nếu có)' &&
        docker-compose down || echo '[WARNING] Không có container cũ' &&

        echo '🔄 Build và khởi động lại container' &&
        docker-compose up -d --build &&

        echo '🧹 Dọn dẹp image không dùng' &&
        docker image prune -f &&

        echo '✅ Deploy thành công!'
      "

```

## VIII. TEST VÀ TROUBLESHOOTING

### 1. Test CI/CD Pipeline
```bash
# Push code để trigger pipeline
git add .
git commit -m "Add GitLab CI/CD pipeline"
git push origin main
```

### 2. Kiểm tra Pipeline
- Vào Project → CI/CD → Pipelines
- Click vào pipeline đang chạy để xem logs

### 3. Troubleshooting thường gặp

**Lỗi SSH Permission denied:**
```bash
# Kiểm tra SSH key trên VPS2
ls -la ~/.ssh/
cat ~/.ssh/authorized_keys
```

**Lỗi Runner không kết nối được:**
```bash
# Kiểm tra runner status
sudo gitlab-runner verify
sudo gitlab-runner restart
```

**Lỗi Private Key format:**
- Đảm bảo copy đúng format private key
- Không có thêm space hoặc newline

## NOTES
- GitLab khởi động khá lâu, hãy kiên nhẫn chờ
- Đảm bảo port 8003 và 8004 đã được mở trên firewall
- Private key phải được bảo mật tuyệt đối
- Nên sử dụng protected variables cho thông tin nhạy cảm

## LIÊN HỆ
- Nếu gặp vấn đề, check logs: `docker logs gitlab`
- GitLab documentation: https://docs.gitlab.com/