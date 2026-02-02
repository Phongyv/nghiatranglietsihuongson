import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Kiểm tra biến môi trường
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const range = process.env.GOOGLE_SHEETS_RANGE || 'Sheet1!A1:Z1000';
    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (!spreadsheetId || !serviceAccountEmail || !privateKey) {
      return NextResponse.json(
        { 
          error: 'Thiếu thông tin cấu hình Google Sheets. Vui lòng kiểm tra file .env.local',
          missing: {
            spreadsheetId: !spreadsheetId,
            serviceAccountEmail: !serviceAccountEmail,
            privateKey: !privateKey
          }
        },
        { status: 500 }
      );
    }

    // Tạo Google Sheets client với Service Account
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: serviceAccountEmail,
        private_key: privateKey.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Lấy dữ liệu từ Google Sheets
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return NextResponse.json({ 
        data: [], 
        message: 'Không có dữ liệu trong sheet' 
      });
    }

    // Chuyển đổi dữ liệu thành JSON
    // Dòng đầu tiên là header
    const headers = rows[0];
    const data = rows.slice(1).map((row) => {
      const obj: Record<string, any> = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || '';
      });
      return obj;
    });

    return NextResponse.json({
      success: true,
      count: data.length,
      data,
    });

  } catch (error: any) {
    console.error('Error fetching Google Sheets data:', error);
    return NextResponse.json(
      { 
        error: 'Lỗi khi lấy dữ liệu từ Google Sheets',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
