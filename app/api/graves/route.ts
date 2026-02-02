import fs from 'fs';
import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export const revalidate = 0; // Tắt cache để cập nhật realtime

export async function GET(request: NextRequest) {
  try {
    const villageId = request.nextUrl.searchParams.get('villageId');

    if (!villageId) {
      return NextResponse.json(
        { error: 'Thiếu villageId' },
        { status: 400 }
      );
    }

    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    if (!spreadsheetId) {
      return NextResponse.json(
        { error: 'Thiếu GOOGLE_SHEETS_SPREADSHEET_ID' },
        { status: 500 }
      );
    }

    // Read service account from environment variable or JSON file
    let serviceAccount;
    const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT;
    
    if (serviceAccountJson) {
      serviceAccount = JSON.parse(serviceAccountJson);
    } else {
      const serviceAccountPath = path.join(process.cwd(), 'tuvitarotbyyou-204f811739ed.json');
      serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    }

    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Fetch graves from the specific village sheet
    const sheetsResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${villageId}!A1:J1000`,
    });

    const rows = sheetsResponse.data.values;

    if (!rows || rows.length === 0) {
      return NextResponse.json({
        data: [],
        message: 'Không có dữ liệu ô mộ',
      });
    }

    // Expected columns: Liệt sĩ, Ngày sinh, Quê quán, Chức vụ, Ngày nhập ngũ, Ngày hy sinh, Nơi hy sinh, Khu, Hàng số, Mộ số
    const data = rows
      .slice(1) // Skip header row
      .filter((row) => row[0]) // Filter rows with name
      .map((row, index) => {
        return {
          id: `${villageId}-${index}`,
          villageId: villageId,
          name: row[0] || 'Chưa xác định',
          birthYear: row[1] || '',
          hometown: row[2] || '',
          position: row[3] || '',
          enlistmentDate: row[4] || '',
          deathDate: row[5] || '',
          deathPlace: row[6] || '',
          area: row[7] || '',
          row: parseInt(row[8]) || 0,
          col: parseInt(row[9]) || 0,
        };
      });

    const response = NextResponse.json({
      success: true,
      count: data.length,
      data,
    });
    
    // Tắt cache để cập nhật realtime
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    return response;
  } catch (error: any) {
    console.error('Error fetching graves:', error);
    return NextResponse.json(
      {
        error: 'Lỗi khi lấy dữ liệu ô mộ',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
