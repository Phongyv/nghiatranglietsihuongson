# Admin Endpoint - Quản lý Ô Mộ

## Tổng Quan
Phiên bản này bổ sung thêm một endpoint `/admin` cho phép quản lý và chỉnh sửa thông tin ô mộ từ danh sách các liệt sỹ.

## Tính Năng

### 1. **Trang Quản Lý (/admin)**
Địa chỉ: `http://localhost:3000/admin`

Trang quản lý cung cấp:
- **Danh sách thôn**: Hiển thị tất cả các thôn/nghĩa trang trong hệ thống
- **Danh sách ô mộ**: Hiện thị danh sách các liệt sỹ theo thôn được chọn
- **Thanh tìm kiếm**: Tìm ô mộ theo tên hoặc khu
- **Bảng dữ liệu**: Hiển thị thông tin cơ bản của mỗi ô:
  - Tên liệt sỹ
  - Khu (A, B, C, D, ...)
  - Hàng số
  - Mộ số
  - Năm sinh
  - Quê quán
  - Nút "Chỉnh sửa"

### 2. **Chỉnh Sửa Thông Tin**
Nhấn nút "Chỉnh sửa" trên bất kỳ hàng nào để mở form chỉnh sửa:

#### Các trường có thể chỉnh sửa:
- **Tên liệt sỹ** (bắt buộc)
- **Năm sinh**
- **Quê quán**
- **Chức vụ** (VD: Chiến sỹ, Tiểu đội trưởng, ...)
- **Ngày nhập ngũ** (VD: 01/01/1968)
- **Ngày hy sinh** (VD: 10/05/1972)
- **Nơi hy sinh** (VD: Quảng Trị, Lào, Campuchia, ...)
- **Khu** (A, B, C, D, ...)
- **Hàng số**
- **Mộ số**
- **Tiểu sử** (mô tả chi tiết về liệt sỹ)

### 3. **Lưu Thay Đổi**
- Nhấn nút "Cập nhật" để lưu thay đổi vào Google Sheets
- Thông báo thành công sẽ xuất hiện khi cập nhật thành công
- Modal sẽ tự động đóng sau 1.5 giây

### 4. **Hủy Chỉnh Sửa**
- Nhấn nút "Hủy" hoặc nhấp vào nền mờ để đóng form mà không lưu thay đổi

## Truy Cập Admin

### Từ Trang Chính
- Nhấp vào nút "Quản lý" ở góc trên bên phải của header

### Trực Tiếp qua URL
- Truy cập trực tiếp: `http://localhost:3000/admin`

## Kiến Trúc

### Frontend
- **Tệp**: `/app/admin/page.tsx`
- Component hiển thị danh sách thôn, các ô mộ, và xử lý logic chức năng
- Lấy dữ liệu từ API `/api/villages` và `/api/graves`

### Edit Modal
- **Tệp**: `/app/components/GraveEditModal.tsx`
- Component form chỉnh sửa thông tin ô mộ
- Gửi dữ liệu cập nhật tới API `/api/admin/graves`

### API Endpoint
- **Tệp**: `/app/api/admin/graves/route.ts`
- **Method**: `PUT`
- **Request Body**:
  ```json
  {
    "villageId": "Tên thôn",
    "graveId": "ID của ô mộ",
    "grave": {
      "id": "...",
      "villageId": "...",
      "name": "Tên liệt sỹ",
      "birthYear": "1950",
      "hometown": "Quê quán",
      "position": "Chức vụ",
      "enlistmentDate": "01/01/1968",
      "deathDate": "10/05/1972",
      "deathPlace": "Nơi hy sinh",
      "area": "A",
      "row": 1,
      "col": 2,
      "description": "Tiểu sử"
    }
  }
  ```

## Đồng Bộ Dữ Liệu
- Dữ liệu được lưu trực tiếp vào Google Sheets
- Khi cập nhật từ admin, thông tin sẽ được cập nhật vào sheet tương ứng
- Dữ liệu trên trang chính sẽ được làm mới khi lần tiếp theo truy cập

## Yêu Cầu
- Google Sheets API phải được cấu hình và có quyền viết (write access)
- Biến môi trường `GOOGLE_SHEETS_SPREADSHEET_ID` phải được thiết lập

## Ghi Chú
- Hiện tại endpoint không có xác thực (authentication). Cân nhắc thêm bảo mật nếu sử dụng trên môi trường production
- Khả năng xóa ô mộ có thể được thêm vào trong tương lai
- Có thể thêm tính năng nhập khẩu/xuất khẩu dữ liệu
