# Docker Setup Instructions

Dự án này đã được containerized với Docker để người khác có thể chạy mà không cần cài đặt các package cục bộ.

## Yêu cầu
- Docker
- Docker Compose

## Cách sử dụng

### Chạy ứng dụng

```bash
# Build và chạy container
docker-compose up --build

# Hoặc chạy trong background
docker-compose up -d --build
```

Ứng dụng sẽ chạy tại: `http://localhost:5173`

### Các lệnh hữu ích

```bash
# Dừng containers
docker-compose down

# Xem logs
docker-compose logs -f

# Vào terminal của container
docker-compose exec growthedu-app sh

# Rebuild containers
docker-compose up --build --force-recreate

# Xóa tất cả containers và volumes
docker-compose down -v --remove-orphans
```

### Cấu trúc files Docker

- `Dockerfile` - Container cho development
- `docker-compose.yml` - Cấu hình Docker Compose
- `.dockerignore` - Files/folders bị bỏ qua khi build

### Lưu ý

- Container sử dụng volume mounting nên code changes sẽ được hot reload
- Tất cả dependencies được cài đặt trong container, không ảnh hưởng đến máy host
- Port 5173 được expose để truy cập ứng dụng từ browser
