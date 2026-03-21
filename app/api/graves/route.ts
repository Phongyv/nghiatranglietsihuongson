import fs from 'fs';
import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export const revalidate = 0; // Tắt cache để cập nhật realtime

export async function GET(request: NextRequest) {
  try {
    const villageId = request.nextUrl.searchParams.get('villageId');
    const includeHiddenParam = request.nextUrl.searchParams.get('includeHidden');
    const includeHidden = includeHiddenParam === 'true' || includeHiddenParam === '1';

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

    const parseHiddenValue = (value: string | undefined) => {
      const normalized = String(value || '').trim().toLowerCase();
      return ['1', 'true', 'x', 'hidden', 'yes'].includes(normalized);
    };

    // Fetch graves from the specific village sheet
    const sheetsResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${villageId}!A1:K1000`,
    });

    const rows = sheetsResponse.data.values;

    if (!rows || rows.length === 0) {
      return NextResponse.json({
        data: [],
        message: 'Không có dữ liệu ô mộ',
      });
    }

    // Expected columns: Khu, Hàng số, Mộ số, Tên sĩ, Ngày sinh, Quê quán, Chức vụ, Ngày nhập ngũ, Ngày hy sinh, Nơi hy sinh, Ẩn
    const data = rows
      .slice(1) // Skip header row
      .map((row, index) => {
        const area = String(row[0] || '').trim();
        const rowNumber = parseInt(String(row[1] || '').trim()) || 0;
        const colNumber = parseInt(String(row[2] || '').trim()) || 0;
        const name = String(row[3] || '').trim();
        const hidden = parseHiddenValue(row[10]);

        const hasName = Boolean(name);
        const hasSlotInfo = Boolean(area) && rowNumber > 0 && colNumber > 0;
        const isAutoFilled = !hasName && hasSlotInfo;

        if (!hasName && !hasSlotInfo && !hidden) {
          return null;
        }

        return {
          id: `${villageId}-${index + 2}`,
          villageId: villageId,
          name,
          displayName: hasName
            ? name
            : `Ô trống Khu ${area} - Hàng ${rowNumber} - Mộ ${colNumber}`,
          birthYear: row[4] || '',
          hometown: row[5] || '',
          position: row[6] || '',
          enlistmentDate: row[7] || '',
          deathDate: row[8] || '',
          deathPlace: row[9] || '',
          area,
          row: rowNumber,
          col: colNumber,
          hidden,
          isAutoFilled,
        };
      })
      .filter((grave) => Boolean(grave))
      .filter((grave) => includeHidden || !grave.hidden);

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
