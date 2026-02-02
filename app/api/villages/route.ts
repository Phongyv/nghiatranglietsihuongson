import fs from 'fs';
import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import path from 'path';

export const revalidate = 0; // No cache

export async function GET() {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    if (!spreadsheetId) {
      return NextResponse.json(
        { error: 'Thiếu GOOGLE_SHEETS_SPREADSHEET_ID' },
        { status: 500 }
      );
    }

    // Read service account from JSON file
    const serviceAccountPath = path.join(process.cwd(), 'tuvitarotbyyou-204f811739ed.json');
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Fetch sheet names (each sheet represents a village)
    const sheetsMeta = await sheets.spreadsheets.get({ spreadsheetId });
    const sheetTitles = (sheetsMeta.data.sheets || [])
      .map((s) => s.properties?.title)
      .filter((title): title is string => Boolean(title));

    // For each sheet, read K2:M2 (Số khu, Số hàng, Số dãy)
    const villages = await Promise.all(
      sheetTitles.map(async (title) => {
        try {
          const metaResponse = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${title}!K2:M2`,
          });

          const values = metaResponse.data.values?.[0] || [];
          const numKhu = parseInt(values[0]) || 0;
          const numHang = parseInt(values[1]) || 0;
          const numDay = parseInt(values[2]) || 0;

          return {
            id: title,
            name: title,
            numKhu,
            numHang,
            numDay,
            totalGraves: numKhu * numHang * numDay,
          };
        } catch {
          return {
            id: title,
            name: title,
            numKhu: 0,
            numHang: 0,
            numDay: 0,
            totalGraves: 0,
          };
        }
      })
    );

    const response = NextResponse.json({
      success: true,
      count: villages.length,
      data: villages,
    });
    
    // Disable cache
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    return response;
  } catch (error: any) {
    console.error('Error fetching villages:', error);
    return NextResponse.json(
      {
        error: 'Lỗi khi lấy danh sách thôn',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
