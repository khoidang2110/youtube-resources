# File chạy ở vps thứ hai
```bash
docker run -d \
  --name zabbix-agent \
  --restart unless-stopped \
  -e ZBX_SERVER_HOST=john2110.ddns.net \
  -e ZBX_HOSTNAME="ebw2" \
  -p 10050:10050 \
  zabbix/zabbix-agent:alpine-7.0-latest

```
