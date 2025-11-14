CI/CD DEPLOY WEB LÊN VPS QUA SSH (GITHUB ACTIONS + DOCKER COMPOSE)

------------------------------------------------------------
1. TẠO REPO VÀ PUSH CODE LÊN GITHUB
------------------------------------------------------------

git init
git remote add origin https://github.com/<username>/<repo>.git
git add .
git commit -m "init commit"
git push -u origin main


------------------------------------------------------------
2. TẠO SSH KEY ĐỂ GITHUB ACTIONS SSH VÀO VPS
------------------------------------------------------------

ssh-keygen -t ed25519 -C "demokey" -f ~/.ssh/demokey

File sinh ra:
- Private key: ~/.ssh/demokey
- Public key:  ~/.ssh/demokey.pub


------------------------------------------------------------
3. THÊM PUBLIC KEY VÀO VPS
------------------------------------------------------------

Trên local:
cat ~/.ssh/demokey.pub

Trên VPS (user khoi):
nano ~/.ssh/authorized_keys
-> Dán public key vào

Set quyền:
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh


------------------------------------------------------------
4. TEST SSH TỪ LOCAL VÀO VPS
------------------------------------------------------------

ssh -i ~/.ssh/demokey khoi@SERVER_IP


------------------------------------------------------------
5. CÀI ĐẶT GIT TRÊN VPS VÀ CẤU HÌNH USER
------------------------------------------------------------

sudo apt install git -y

git config --global user.name "khoi"
git config --global user.email "your_email@example.com"


------------------------------------------------------------
6. CLONE REPO TRÊN VPS (DÙNG USER khoi - KHÔNG DÙNG ROOT)
------------------------------------------------------------

cd /home/khoi

git clone https://github.com/<username>/<repo>.git

Lưu ý:
URL phải có .git
Ví dụ đúng:
https://github.com/khoidang2110/samar-cicd.git


------------------------------------------------------------
7. CHẠY DOCKER COMPOSE ĐỂ DEPLOY LẦN ĐẦU
------------------------------------------------------------

cd /home/khoi/<repo>

docker compose up -d --build


------------------------------------------------------------
8. CẤU HÌNH GITHUB ACTIONS SECRETS CHO CI/CD
------------------------------------------------------------

Vào GitHub:
Repo -> Settings -> Secrets -> Actions -> New secret

Tạo các biến:

SERVER_HOST      = SERVER_IP
SERVER_USER      = khoi
SSH_PRIVATE_KEY  = nội dung file demokey
DEPLOY_PATH      = /home/khoi/<repo>


------------------------------------------------------------
9. FILE deploy.yml ĐÃ CÓ SẴN TRONG SOURCE CODE
------------------------------------------------------------

Không cần tạo lại.
Workflow sẽ tự chạy mỗi khi push code mới.


------------------------------------------------------------
10. TEST CI/CD BẰNG CÁCH PUSH CODE
------------------------------------------------------------

git add .
git commit -m "test cicd"
git push

GitHub Actions sẽ tự động:
1. SSH vào VPS
2. git pull
3. docker compose up -d --build

CI/CD hoạt động hoàn toàn tự động.


------------------------------------------------------------
HOÀN TẤT QUY TRÌNH CI/CD
------------------------------------------------------------
