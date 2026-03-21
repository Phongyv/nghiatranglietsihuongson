# Nghĩa Trang Liệt Sĩ Xã Hương Sơn

Tài liệu này hướng dẫn setup môi trường và chạy dự án local.

## 1) Yêu cầu

- Node.js 20+ (khuyến nghị LTS)
- npm 10+
- Tài khoản Google Cloud + Google Sheets
- (Tùy chọn) Python 3.9+ nếu dùng script tạo `.env.local`

## 2) Cài dependency

```bash
cd d:\nghia-trang-huong-son
npm install
```

## 3) Cấu hình biến môi trường

Tạo file `.env.local` ở root project.

Bạn có 2 cách cấu hình credentials:

### Cách A (khuyến nghị): dùng `GOOGLE_SERVICE_ACCOUNT` dạng JSON string

```env
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id
GOOGLE_SHEETS_RANGE=Sheet1!A1:Z1000
GOOGLE_SERVICE_ACCOUNT={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n","client_email":"...","client_id":"..."}
```

### Cách B: tách từng biến (đang được hỗ trợ fallback)

```env
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id
GOOGLE_SHEETS_RANGE=Sheet1!A1:Z1000
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

> Lưu ý: một số API route còn fallback đọc file JSON ở root tên `tuvitarotbyyou-204f811739ed.json` nếu không có `GOOGLE_SERVICE_ACCOUNT`.

## 4) Setup Google Cloud / Google Sheets

1. Tạo Service Account trên Google Cloud.
2. Bật Google Sheets API.
3. Download JSON key của Service Account.
4. Share Google Sheet cho email Service Account (quyền Viewer để đọc, Editor để cập nhật từ trang admin).

## 5) Cấu trúc dữ liệu Google Sheet

### Sheet cấu hình thôn

- Tên sheet: `Danh Sách Thôn`
- Dữ liệu dùng vùng `A2:D1000`
- Cột:
  - A: Tên thôn
  - B: Khu (A/B/C/D...)
  - C: Số hàng
  - D: Số dãy

### Sheet dữ liệu từng thôn

Mỗi thôn là 1 sheet riêng, dùng vùng `A1:J1000` với cột:

1. Khu
2. Hàng số
3. Mộ số
4. Tên sĩ
5. Ngày sinh
6. Quê quán
7. Chức vụ
8. Ngày nhập ngũ
9. Ngày hy sinh
10. Nơi hy sinh

## 6) Chạy dự án

### Development

```bash
npm run dev
```

Mở:

- Trang chính: `http://localhost:3000`
- Trang admin: `http://localhost:3000/admin`

### Production local

```bash
npm run build
npm run start
```

## 7) Kiểm tra nhanh API

- `GET /api/villages`
- `GET /api/areas?villageId=<ten-thon>`
- `GET /api/graves?villageId=<ten-thon>`
- `GET /api/sheets`

Nếu API trả lỗi cấu hình, kiểm tra lại `.env.local` và quyền share Google Sheet.

## 8) Script hỗ trợ

- `setup_env.py`: hỗ trợ nhập thông tin và tạo `.env.local` tương tác.
- `scripts/populate_google_sheets.py`: script mẫu để tạo/populate dữ liệu lên Google Sheets.

## 9) Lỗi thường gặp

- `Thiếu GOOGLE_SHEETS_SPREADSHEET_ID`: chưa set ID Google Sheet.
- `private_key` lỗi format: thiếu `\n` trong key hoặc quote sai.
- `The caller does not have permission`: chưa share sheet cho Service Account.
- Không thấy dữ liệu thôn: sheet `Danh Sách Thôn` sai tên hoặc thiếu cột A-D.
