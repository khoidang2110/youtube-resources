```bash
# Tạo toàn bộ cấu trúc thư mục
mkdir -p wordpress-ansible/{inventories/production/group_vars,roles/{database,wordpress,proxy}/{tasks,handlers,templates,vars},playbooks}

cd wordpress-ansible

# Tạo các file cần thiết
touch ansible.cfg site.yml
touch inventories/production/hosts.ini
touch inventories/production/group_vars/{all,db,frontend,proxy}.yml
touch roles/database/{tasks,handlers}/main.yml
touch roles/wordpress/{tasks,handlers}/main.yml
touch roles/wordpress/templates/{wp-config.php.j2,wordpress.conf.j2}
touch roles/proxy/{tasks,handlers}/main.yml
touch roles/proxy/templates/wordpress.conf.j2
touch playbooks/{wordpress,proxy-only}.yml

```

### cách chạy

```bash
# Di chuyển vào thư mục dự án
cd wordpress-ansible

# Deploy toàn bộ
ansible-playbook site.yml

# Deploy từng phần
ansible-playbook playbooks/wordpress.yml

# Kiểm tra inventory
ansible-inventory --list

# Test connection
ansible all -m ping

```