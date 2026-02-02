#!/usr/bin/env python3
"""
Script giúp setup Google Sheets credentials vào .env.local
Sử dụng: python setup_env.py
"""

import json
import os
from pathlib import Path


def main():
    print("=" * 60)
    print("🚀 Google Sheets Environment Setup Script")
    print("=" * 60)
    print()

    # Spreadsheet ID
    print("📋 Bước 1: Spreadsheet ID")
    print("Mở Google Sheet, lấy ID từ URL")
    print("  URL: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit")
    print()
    spreadsheet_id = input("Nhập Spreadsheet ID: ").strip()

    if not spreadsheet_id:
        print("❌ Error: Spreadsheet ID không được để trống")
        return

    # Google Sheets Range
    print()
    print("📋 Bước 2: Google Sheets Range (tên sheet + vùng dữ liệu)")
    print("  Mặc định: Sheet1!A1:Z1000")
    print("  Ví dụ: Data!A1:E100")
    sheets_range = input("Nhập Range (hoặc Enter để mặc định): ").strip()
    if not sheets_range:
        sheets_range = "Sheet1!A1:Z1000"

    # Service Account JSON
    print()
    print("📋 Bước 3: Service Account JSON Key")
    print("Tìm file JSON vừa download từ Google Cloud (*.json)")
    print()

    json_path = input("Nhập đường dẫn tới file JSON key: ").strip()
    json_path = json_path.strip('"').strip("'")  # Xóa dấu ngoặc nếu có

    if not os.path.exists(json_path):
        print(f"❌ Error: File không tìm thấy: {json_path}")
        return

    try:
        with open(json_path, "r") as f:
            service_account = json.load(f)
    except json.JSONDecodeError:
        print("❌ Error: File JSON không hợp lệ")
        return
    except Exception as e:
        print(f"❌ Error: {e}")
        return

    # Extract từ JSON
    client_email = service_account.get("client_email", "")
    private_key = service_account.get("private_key", "")

    if not client_email or not private_key:
        print("❌ Error: File JSON thiếu client_email hoặc private_key")
        return

    # Create .env.local
    print()
    print("=" * 60)
    print("✅ Thông tin đã lấy thành công!")
    print("=" * 60)
    print()

    env_content = f"""# Google Sheets Configuration
GOOGLE_SHEETS_SPREADSHEET_ID={spreadsheet_id}
GOOGLE_SHEETS_RANGE={sheets_range}
GOOGLE_SERVICE_ACCOUNT_EMAIL={client_email}
GOOGLE_PRIVATE_KEY="{private_key}"
"""

    # Show preview
    print("📝 Preview nội dung .env.local:")
    print("-" * 60)
    print(f"GOOGLE_SHEETS_SPREADSHEET_ID={spreadsheet_id}")
    print(f"GOOGLE_SHEETS_RANGE={sheets_range}")
    print(f"GOOGLE_SERVICE_ACCOUNT_EMAIL={client_email}")
    print(f"GOOGLE_PRIVATE_KEY=<hidden - {len(private_key)} characters>")
    print("-" * 60)
    print()

    # Ask to confirm
    confirm = input("Bạn có muốn tạo file .env.local không? (y/n): ").strip().lower()

    if confirm != "y":
        print("❌ Đã hủy")
        return

    # Write .env.local
    env_path = Path(".env.local")

    if env_path.exists():
        backup = input(".env.local đã tồn tại. Tạo backup không? (y/n): ").strip().lower()
        if backup == "y":
            import shutil

            shutil.copy(".env.local", ".env.local.backup")
            print("✅ Backup tại: .env.local.backup")

    with open(".env.local", "w") as f:
        f.write(env_content)

    print()
    print("=" * 60)
    print("✅ .env.local đã được tạo thành công!")
    print("=" * 60)
    print()
    print("📝 Tiếp theo:")
    print("  1. Share Google Sheet với email service account")
    print(f"     Email: {client_email}")
    print("  2. Chạy: npm run dev")
    print("  3. Truy cập: http://localhost:3000")
    print()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n❌ Đã hủy")
    except Exception as e:
        print(f"❌ Lỗi: {e}")
