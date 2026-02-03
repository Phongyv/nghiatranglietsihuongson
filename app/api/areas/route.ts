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

    // Fetch area configuration from "Danh Sách Thôn" sheet
    // A: Thôn (Village name)
    // B: Khu (Area: A, B, C, D)
    // C: Số hàng (Number of rows)
    // D: Số dãy (Number of columns)
    const areasResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `Danh Sách Thôn!A2:D1000`, // Đọc từ dòng 2 trở đi (bỏ header)
    });

    const rows = areasResponse.data.values;

    if (!rows || rows.length === 0) {
      return NextResponse.json({
        data: [],
        message: 'Không có dữ liệu cấu hình khu',
      });
    }

    // Filter rows for this village and parse area configuration
    const areas = rows
      .filter((row) => row[0] && row[0].toLowerCase().trim() === villageId.toLowerCase().trim()) // Filter by village
      .filter((row) => row[1]) // Filter rows with area name
      .map((row) => {
        return {
          area: row[1] || '', // Tên khu: A, B, C, D
          rows: parseInt(row[2]) || 0, // Số hàng
          cols: parseInt(row[3]) || 0, // Số dãy
          totalGraves: (parseInt(row[2]) || 0) * (parseInt(row[3]) || 0),
        };
      });

    const response = NextResponse.json({
      success: true,
      count: areas.length,
      data: areas,
      villageId,
    });
    
    // Tắt cache để cập nhật realtime
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    return response;
  } catch (error: any) {
    console.error('Error fetching areas:', error);
    return NextResponse.json(
      {
        error: 'Lỗi khi lấy dữ liệu cấu hình khu',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
