# Hướng dẫn cấu trúc Google Sheets

## Cấu trúc chung

Bạn sẽ có **2 loại sheet**:
1. **"Danh Sách Thôn"** - Sheet config chung (quản lý cấu hình khu của các thôn)
2. **Các sheet thôn** (Thôn Yên Võ, Thôn Đức Khê, ...) - Chứa dữ liệu liệt sĩ

---

## Sheet "Danh Sách Thôn" (Config)

Bảng này chứa cấu hình của tất cả các khu của tất cả các thôn. **Số khu tự động xác định dựa trên số dòng** cho mỗi thôn.

### Cấu trúc cột:

| Cột | Tên cột | Mô tả |
|-----|---------|-------|
| A | Thôn | Tên thôn/làng |
| B | Khu | Tên khu: A, B, C, D, ... |
| C | Số Hàng | Số hàng tối đa của khu này |
| D | Số Dãy | Số dãy/cột tối đa của khu này |

### Ví dụ cấu hình:

```
| A              | B | C | D |
|----------------|---|---|---|
| Thôn Yên Võ    | A | 5 | 5 |
| Thôn Yên Võ    | B | 4 | 5 |
| Thôn Yên Võ    | C | 6 | 5 |
| Thôn Yên Võ    | D | 4 | 5 |
| Thôn Đức Khê   | A | 5 | 5 |
| Thôn Đức Khê   | B | 5 | 5 |
| Thôn Đức Khê   | C | 5 | 5 |
| Thôn Đức Khê   | D | 5 | 5 |
| Thôn Tiền Mai  | A | 5 | 5 |
| Thôn Tiền Mai  | B | 5 | 5 |
```

### Lưu ý:
- **Dòng 1**: Header (Thôn, Khu, Số Hàng, Số Dãy)
- **Từ dòng 2 trở đi**: Cấu hình cho từng khu
- **Số khu tự động**: 
  - Thôn Yên Võ có 4 dòng (A, B, C, D) → hiển thị 4 khu
  - Thôn Tiền Mai có 2 dòng (A, B) → hiển thị 2 khu

---

## Các Sheet Thôn (Dữ liệu Liệt Sĩ)

Mỗi sheet đại diện cho một thôn (Thôn Yên Võ, Thôn Đức Khê, ...) và chứa danh sách liệt sĩ.

### Cấu trúc cột:

| Cột | Tên cột | Mô tả |
|-----|---------|-------|
| A | Khu | Tên khu: A, B, C, D, v.v. |
| B | Hàng số | Số hàng (1, 2, 3, ...) |
| C | Mộ số | Số mộ/dãy (1, 2, 3, ...) |
| D | Tên sĩ | Tên liệt sĩ |
| E | Ngày sinh | Năm sinh (VD: 2/9/1945) |
| F | Quê quán | Địa chỉ quê quán |
| G | Chức vụ | Chức vụ trong quân đội |
| H | Ngày nhập ngũ | Ngày nhập ngũ |
| I | Ngày hy sinh | Ngày hy sinh |
| J | Nơi hy sinh | Địa điểm hy sinh |

### Lưu ý:
- **Dòng 1**: Header (tên các cột)
- **Từ dòng 2 trở đi**: Dữ liệu liệt sĩ

### Ví dụ (Sheet "Thôn Yên Võ"):

```
| A | B | C | D              | E       | F             | ... |
|---|---|---|-----------------|---------|-----------    |-----|
| B | 1 | 2 | Ninh Văn Diên   | 2/9/1945| Song Khê 2... | ... |
| B | 1 | 3 | Phan Văn Nghĩa  | 2/9/1945| Tây Trù...    | ... |
```

---

## Cách hoạt động

1. **API `/api/areas`** 
   - Đọc từ sheet "Danh Sách Thôn" (A-D, từ dòng 2)
   - Lọc các khu của thôn được chọn
   - Trả về danh sách khu với cấu hình (số hàng, số dãy)

2. **API `/api/graves`** 
   - Đọc từ sheet thôn (A-J, từ dòng 2)
   - Trả về danh sách liệt sĩ

3. **MapView** 
   - Hiển thị grid dựa trên cấu hình từ sheet "Danh Sách Thôn"
   - Điền dữ liệu liệt sĩ vào từng vị trí trong grid

---

## Lợi ích của thiết kế này

✅ **Tập trung**: Tất cả cấu hình ở 1 sheet, dễ quản lý  
✅ **Linh hoạt**: Mỗi thôn có thể có số khu khác nhau  
✅ **Tự động**: Số khu tự động xác định từ số dòng dữ liệu  
✅ **Chính xác**: Hiển thị đúng layout thực tế của nghĩa trang  
✅ **Dễ mở rộng**: Thêm thôn hoặc khu mới chỉ cần thêm dòng vào sheet config
