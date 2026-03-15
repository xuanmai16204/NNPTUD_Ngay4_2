# NNPTUD-C4 - API Auth (Login, /me, ChangePassword) + JWT RS256

## Cài đặt

```bash
npm install
```

## Tạo cặp khóa RSA 2048-bit (JWT RS256)

```bash
npm run generate-keys
```

Tạo ra 2 file trong `keys/`:
- `keys/private.pem` - Khóa bí mật (ký JWT)
- `keys/public.pem` - Khóa công khai (xác thực JWT)

Nếu chưa có thư mục `keys/`, server sẽ tự tạo khi chạy lần đầu.

## Chạy server

```bash
npm start
```

Server chạy tại `http://localhost:3000`.

## API

### 1. Đăng nhập - POST /auth/login

- **Body (JSON):** `{ "username": "admin", "password": "123456" }`
- **Response:** `{ "message", "token", "user" }`  
- Dùng `token` cho các request cần đăng nhập (header `Authorization: Bearer <token>`).

### 2. Thông tin user - GET /auth/me

- **Header:** `Authorization: Bearer <token>`
- **Response:** `{ "id", "username", "email" }`

### 3. Đổi mật khẩu - POST /auth/change-password (yêu cầu đăng nhập)

- **Header:** `Authorization: Bearer <token>`
- **Body (JSON):** `{ "oldPassword": "...", "newPassword": "..." }`
- **Validate newPassword:** tối thiểu 8 ký tự, ít nhất 1 chữ hoa, 1 chữ thường, 1 số, 1 ký tự đặc biệt.

## Chụp ảnh Postman (nộp bài)

1. **Login:**  
   - Method: POST  
   - URL: `http://localhost:3000/auth/login`  
   - Body → raw → JSON: `{"username":"admin","password":"123456"}`  
   - Gửi request, chụp màn hình response (có `token`).

2. **/me:**  
   - Method: GET  
   - URL: `http://localhost:3000/auth/me`  
   - Tab Authorization → Type: Bearer Token → dán `token` từ bước 1.  
   - Gửi request, chụp màn hình response.

Lưu 2 ảnh vào thư mục `screenshots/` (hoặc nơi yêu cầu) rồi commit cùng repo.

## JWT RS256

- Thuật toán: **RS256** (RSA + SHA-256).
- Khóa: **RSA 2048-bit** (modulusLength: 2048).
- 2 file mã hóa nộp Git: `keys/private.pem` và `keys/public.pem` (đã tạo bằng `npm run generate-keys`).

## Nộp Git

- Commit và push: toàn bộ code + thư mục `keys/` (2 file `private.pem`, `public.pem`) + 2 ảnh chụp Postman (login và /me).
