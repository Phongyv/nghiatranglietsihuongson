# Hướng dẫn cấu trúc Google Sheet cho dự án

## 📊 Cấu trúc hiện tại của bạn

Google Sheet của bạn đã có cấu trúc tốt với **mỗi thôn là một sheet riêng**.

### Danh sách các sheet (thôn):
- Thôn đức khê
- Thôn Yên Vĩ
- Thôn Tiên Mai
- Thôn Hội Xá
- Thôn Phú Yên

---

## 📋 Cấu trúc mỗi sheet thôn

Mỗi sheet cần có các cột sau (dòng 1 là header):

| Cột | Tên cột | Kiểu dữ liệu | Ví dụ |
|-----|---------|--------------|-------|
| A | **Liệt sĩ** | Text | Đào Văn Khứa |
| B | **Ngày sinh** | Text/Year | 1930 |
| C | **Quê quán** | Text | Song Khê 1, Song Khê, TP Bắc Giang |
| D | **Ngày nhập ngũ** | Text | Chưa rõ / 01/01/1948 |
| E | **Chức vụ** | Text | Du kích / Đại tá |
| F | **Ngày hy sinh** | Text | 17/8/1949 |
| G | **Nơi hy sinh** | Text | Chưa rõ / Điện Biên Phủ |
| H | **Khu** | Text | A / B / C |
| I | **Hàng số** | Number | 6 |
| J | **Mộ số** | Number | 3 |

---

## 🎯 Ví dụ dữ liệu hoàn chỉnh

### Sheet "Thôn đức khê"

```
Liệt sĩ         | Ngày sinh | Quê quán                           | Ngày nhập ngũ | Chức vụ    | Ngày hy sinh | Nơi hy sinh      | Khu | Hàng số | Mộ số
Đào Văn Khứa    | 1930      | Song Khê 1, TP Bắc Giang           | Chưa rõ       | Du kích    | 17/8/1949    | Chưa rõ          | A   | 6       | 3
Nguyễn Văn An   | 1925      | Hà Nội                             | 01/01/1945    | Đại úy     | 20/12/1972   | Quảng Trị        | A   | 1       | 1
Trần Văn Bình   | 1928      | Nam Định                           | 15/03/1946    | Trung sĩ   | 05/05/1968   | Khe Sanh         | B   | 2       | 5
```

---

## ✅ Checklist dữ liệu

### Header row (dòng 1) phải có:
- [ ] Liệt sĩ
- [ ] Ngày sinh
- [ ] Quê quán
- [ ] Ngày nhập ngũ
- [ ] Chức vụ
- [ ] Ngày hy sinh
- [ ] Nơi hy sinh
- [ ] Khu
- [ ] Hàng số
- [ ] Mộ số

### Dữ liệu (từ dòng 2):
- [ ] Mỗi dòng là một liệt sỹ
- [ ] Cột "Liệt sĩ" bắt buộc phải có (không để trống)
- [ ] Cột "Hàng số" và "Mộ số" là số (để hiển thị sơ đồ mộ)
- [ ] Các cột khác có thể để trống hoặc ghi "Chưa rõ"

---

## 🗺️ Cách hoạt động của sơ đồ mộ

- **Khu**: Phân chia khu vực (A, B, C...) - hiển thị trong modal
- **Hàng số**: Vị trí hàng trong sơ đồ (1, 2, 3, ...)
- **Mộ số**: Vị trí cột trong sơ đồ (1, 2, 3, ...)

Ví dụ: Liệt sỹ "Đào Văn Khứa" ở **Khu A, Hàng 6, Mộ 3**
→ Sẽ hiển thị ở ô (row=6, col=3) trong sơ đồ

---

## 🔧 Cấu hình .env.local

Chỉ cần 3 biến:

```env
# ID của Google Sheet (từ URL)
GOOGLE_SHEETS_SPREADSHEET_ID=1Qq9JKuYE1ckhbfrQXFs0OPLRK-DyJeCm_qaSQ7kHeb0

# Service Account Email
GOOGLE_SERVICE_ACCOUNT_EMAIL=nghiatranhuongson@tuvitarotbyyou.iam.gserviceaccount.com

# Private Key (từ JSON)
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

**Không cần** `GOOGLE_SHEETS_RANGE` nữa vì app sẽ tự động lấy từ tất cả các sheets!

---

## 🚀 Cách thêm thôn mới

1. Tạo sheet mới trong Google Sheets
2. Đặt tên sheet = tên thôn (ví dụ: "Thôn Mới")
3. Thêm header row (dòng 1) với 10 cột như bảng trên
4. Điền dữ liệu liệt sỹ từ dòng 2
5. Refresh website → Thôn mới sẽ tự động xuất hiện!

---

## 📝 Lưu ý quan trọng

### 1. Tên sheet = Tên thôn
- Tên sheet sẽ hiển thị trên trang chủ
- Nên đặt tên rõ ràng, có dấu

### 2. Thứ tự cột phải đúng
- Cột A = Liệt sĩ
- Cột B = Ngày sinh
- ... (theo bảng trên)
- Nếu sai thứ tự, dữ liệu sẽ hiển thị sai

### 3. Số hàng và mộ
- Bắt đầu từ 1 (không phải 0)
- Ví dụ: Hàng 1, Mộ 1 → vị trí (row=1, col=1)

### 4. Dữ liệu có thể để trống
- Nếu không biết thông tin → ghi "Chưa rõ"
- Hoặc để trống → sẽ không hiển thị trong modal

---

## 🎨 Tùy chỉnh hiển thị

### Thêm ảnh liệt sỹ (tương lai)
Hiện tại chưa có cột ảnh. Nếu muốn thêm:
1. Thêm cột K: **Hình ảnh** (URL của ảnh)
2. Cập nhật code trong `app/api/graves/route.ts`

### Thêm tiểu sử (tương lai)
1. Thêm cột L: **Tiểu sử**
2. Cập nhật code trong `app/api/graves/route.ts`

---

## ✅ Test dữ liệu

1. Đảm bảo Google Sheet đã share với service account
2. Chạy: `npm run dev`
3. Truy cập: http://localhost:3000
4. Kiểm tra:
   - Danh sách thôn hiển thị đúng không?
   - Click vào thôn → Sơ đồ mộ hiển thị không?
   - Click vào ô mộ → Modal thông tin đầy đủ không?

---

## 🐛 Troubleshooting

### Không hiển thị thôn
→ Kiểm tra sheet có tên chính xác, không có ký tự đặc biệt lạ

### Không hiển thị liệt sỹ
→ Kiểm tra dòng 1 có đúng là header không
→ Kiểm tra cột "Liệt sĩ" (cột A) có dữ liệu không

### Sơ đồ mộ lộn xộn
→ Kiểm tra "Hàng số" và "Mộ số" có phải là số không
→ Không để trống hoặc ghi chữ

---

**Mọi thứ đã sẵn sàng với cấu trúc sheet hiện tại của bạn! 🎉**
