# Dockerfile
FROM nginx:alpine

# Remove default web files
RUN rm -rf /usr/share/nginx/html/*

# Copy the static site into the nginx html folder
COPY . /usr/share/nginx/html

# Replace default nginx site to listen on port 3000 (so container listens on 3000)
# Create a minimal server config that serves files from /usr/share/nginx/html
RUN printf '%s\n' \
	'server {' \
	'    listen       3000;' \
	'    server_name  localhost;' \
	'    root   /usr/share/nginx/html;' \
	'    index  index.html index.htm;' \
	'    location / {' \
	'        try_files $uri $uri/ =404;' \
	'    }' \
	'}' \
	> /etc/nginx/conf.d/default.conf

# Expose the container port 3000
EXPOSE 3000
