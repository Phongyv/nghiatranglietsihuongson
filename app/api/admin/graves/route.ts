import fs from 'fs';
import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export const revalidate = 0; // Disable cache

interface Grave {
  id: string;
  villageId: string;
  name: string;
  birthYear?: string;
  hometown?: string;
  position?: string;
  enlistmentDate?: string;
  deathDate?: string;
  deathPlace?: string;
  area?: string;
  row?: number;
  col?: number;
  description?: string;
  hidden?: boolean;
}

interface UpdateRequest {
  villageId: string;
  originalGrave?: Grave;
  grave: Grave;
}

export async function PUT(request: NextRequest) {
  try {
    const body: UpdateRequest = await request.json();
    const { villageId, originalGrave, grave } = body;

    if (!villageId || !grave) {
      return NextResponse.json(
        { error: 'Thiếu thông tin cập nhật' },
        { status: 400 }
      );
    }

    // Use original grave data if provided, otherwise use current grave data
    const searchGrave = originalGrave || grave;

    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    if (!spreadsheetId) {
      return NextResponse.json(
        { error: 'Thiếu GOOGLE_SHEETS_SPREADSHEET_ID' },
        { status: 500 }
      );
    }

    // Read service account
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
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive',
      ],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Fetch all graves to find the row number
    const sheetsResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${villageId}!A1:K1000`,
    });

    const rows = sheetsResponse.data.values;

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { error: 'Không tìm thấy dữ liệu trong sheet' },
        { status: 404 }
      );
    }

    // Find the row that matches the grave by area, row, and col (unique identifiers)
    let graveRowIndex = -1;
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const rowArea = String(row[0] || '');
      const rowRow = parseInt(row[1]) || 0;
      const rowCol = parseInt(row[2]) || 0;

      if (
        rowArea === String(searchGrave.area || '') &&
        rowRow === (searchGrave.row || 0) &&
        rowCol === (searchGrave.col || 0)
      ) {
        graveRowIndex = i + 1; // Google Sheets uses 1-based indexing
        break;
      }
    }

    // Prepare the row data with updated values
    // Columns: Khu, Hàng số, Mộ số, Tên sĩ, Ngày sinh, Quê quán, Chức vụ, Ngày nhập ngũ, Ngày hy sinh, Nơi hy sinh, Ẩn
    const updatedRow = [
      grave.area || '',
      grave.row ?? '',
      grave.col ?? '',
      grave.name,
      grave.birthYear || '',
      grave.hometown || '',
      grave.position || '',
      grave.enlistmentDate || '',
      grave.deathDate || '',
      grave.deathPlace || '',
      grave.hidden ? '1' : '',
    ];

    if (graveRowIndex !== -1) {
      // Row exists, update it
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${villageId}!A${graveRowIndex}:K${graveRowIndex}`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [updatedRow],
        },
      });
    } else {
      // Row doesn't exist, append new row
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${villageId}!A:K`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [updatedRow],
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Cập nhật ô mộ thành công',
      data: grave,
    });
  } catch (error: any) {
    console.error('Error updating grave:', error);
    return NextResponse.json(
      {
        error: 'Lỗi khi cập nhật ô mộ',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
