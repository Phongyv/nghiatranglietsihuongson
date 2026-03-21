#!/usr/bin/env python3
"""
Script để populate dữ liệu liệt sỹ vào Google Sheets
Tạo các sheet cho mỗi thôn và điền dữ liệu
"""

from google.oauth2.service_account import Credentials
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
import json
import os

# Spreadsheet ID từ .env hoặc hardcode
SPREADSHEET_ID = '1Qq9JKuYE1ckhbfrQXFs0OPLRK-DyJeCm_qaSQ7kHeb0'
SERVICE_ACCOUNT_FILE = 'tuvitarotbyyou-204f811739ed.json'

# Dữ liệu mẫu cho các thôn
VILLAGES_DATA = {
    'Thôn Đức Khê': [
        ['Liệt sỹ', 'Ngày sinh', 'Quê quán', 'Chức vụ', 'Ngày nhập ngũ', 'Ngày hy sinh', 'Nơi hy sinh', 'Khu', 'Hàng số', 'Mộ số'],
        ['Ninh Văn Điền', '08/01/1958', 'Sơng Khê, TP Bắc Giang', 'Dư Kích', '01/01/1970', '08/01/1979', 'Quảng Trị', 'A', '1', '1'],
        ['Nguyễn Khắc La', '07/01/1953', 'Đức Khê', 'Chiến sỹ', '01/07/1968', '15/04/1972', 'Quảng Trị', 'A', '1', '2'],
        ['Trần Văn Thơ', '03/01/1952', 'Đức Khê', 'Chiến sỹ', '01/03/1970', '21/10/1972', 'Quảng Trị', 'A', '1', '3'],
        ['Đào Hữu Diễn', '21/10/1952', 'Đức Khê', 'Chiến sỹ', '01/10/1970', '17/08/1969', 'Quảng Bình', 'A', '1', '4'],
        ['Đào Ngọc Thường', '17/08/1949', 'Đức Khê', 'Chiến sỹ', '01/08/1968', '11/01/1952', 'Quảng Trị', 'A', '1', '5'],
        ['Nguyễn Khắc Lực', '11/01/1947', 'Đức Khê', 'Chiến sỹ', '01/01/1965', '20/04/1973', 'Quảng Trị', 'A', '2', '1'],
        ['Bùi Văn Chung', '20/04/1973', 'Đức Khê', 'Chiến sỹ', '01/04/1972', '18/04/1952', 'Quảng Trị', 'A', '2', '2'],
        ['Hoàng Văn Sương', '18/04/1952', 'Đức Khê', 'Chiến sỹ', '01/04/1970', '17/08/1949', 'Quảng Trị', 'A', '2', '3'],
        ['Nguyễn Khắc Tố', '17/08/1949', 'Đức Khê', 'Chiến sỹ', '01/08/1968', '12/07/1968', 'Quảng Trị', 'A', '2', '4'],
        ['Hoàng Xuân Lư', '12/07/1968', 'Đức Khê', 'Chiến sỹ', '01/07/1972', '12/03/1949', 'Quảng Trị', 'A', '2', '5'],
        # Khu B
        ['Giáp Ngọc Huy', '26/06/1969', 'Đức Khê', 'Chiến sỹ', '01/06/1971', '08/02/1968', 'Quảng Trị', 'B', '1', '1'],
        ['Ninh Văn Ngư', '08/02/1968', 'Đức Khê', 'Chiến sỹ', '01/02/1970', '10/09/1969', 'Quảng Bình', 'B', '1', '2'],
        ['Đào Ngọc Tuyên', '10/09/1969', 'Đức Khê', 'Chiến sỹ', '01/09/1971', '21/11/1967', 'Quảng Trị', 'B', '1', '3'],
        ['Đào Ngọc Ân', '21/11/1967', 'Đức Khê', 'Chiến sỹ', '01/11/1969', '20/10/1968', 'Quảng Trị', 'B', '1', '4'],
        ['Nguyễn Thu Chiêm', '20/10/1968', 'Đức Khê', 'Chiến sỹ', '01/10/1970', '22/02/1980', 'Biên giới', 'B', '1', '5'],
        # Khu C
        ['Đào Văn Tịnh', '20/02/1971', 'Đức Khê', 'Chiến sỹ', '01/02/1972', '16/05/1971', 'Lào', 'C', '1', '1'],
        ['Đào Văn Thơi', '16/05/1971', 'Đức Khê', 'Chiến sỹ', '01/05/1973', '20/02/1971', 'Lào', 'C', '1', '2'],
        ['Ninh Văn Chắc', '20/02/1971', 'Đức Khê', 'Chiến sỹ', '01/02/1972', '26/09/1971', 'Lào', 'C', '1', '3'],
        ['Ninh Văn Định', '26/09/1971', 'Đức Khê', 'Chiến sỹ', '01/09/1973', '19/02/1971', 'Lào', 'C', '1', '4'],
        ['Đào Văn Sắp', '19/02/1971', 'Đức Khê', 'Chiến sỹ', '01/02/1972', '19/01/1981', 'Biên giới', 'C', '1', '5'],
        # Khu D
        ['Giáp Văn Việt', '18/05/1972', 'Đức Khê', 'Chiến sỹ', '01/05/1974', '14/03/1972', 'Quảng Trị', 'D', '1', '1'],
        ['Nguyễn Văn Chánh', '14/03/1972', 'Đức Khê', 'Chiến sỹ', '01/03/1974', '31/10/1972', 'Quảng Trị', 'D', '1', '2'],
        ['Đào Quang Khánh', '31/10/1972', 'Đức Khê', 'Chiến sỹ', '01/10/1974', '16/03/1972', 'Quảng Trị', 'D', '1', '3'],
        ['Nguyễn Văn Nhuận', '16/03/1972', 'Đức Khê', 'Chiến sỹ', '01/03/1974', '20/03/1971', 'Lào', 'D', '1', '4'],
        ['Đào Văn Tiệp', '20/03/1971', 'Đức Khê', 'Chiến sỹ', '01/03/1972', '01/02/1978', 'Biên giới', 'D', '1', '5'],
    ],
    'Thôn Yên Vỹ': [
        ['Liệt sỹ', 'Ngày sinh', 'Quê quán', 'Chức vụ', 'Ngày nhập ngũ', 'Ngày hy sinh', 'Nơi hy sinh', 'Khu', 'Hàng số', 'Mộ số'],
        ['Nguyễn Văn A', '01/01/1950', 'Yên Vỹ', 'Chiến sỹ', '01/01/1968', '15/03/1972', 'Quảng Trị', 'A', '1', '1'],
        ['Trần Văn B', '02/02/1951', 'Yên Vỹ', 'Chiến sỹ', '02/02/1969', '20/04/1973', 'Quảng Bình', 'A', '1', '2'],
        ['Lê Văn C', '03/03/1952', 'Yên Vỹ', 'Tiểu đội trưởng', '03/03/1970', '12/05/1974', 'Lào', 'A', '1', '3'],
        ['Phạm Văn D', '04/04/1953', 'Yên Vỹ', 'Chiến sỹ', '04/04/1971', '18/06/1975', 'Campuchia', 'B', '1', '1'],
        ['Hoàng Văn E', '05/05/1954', 'Yên Vỹ', 'Chiến sỹ', '05/05/1972', '25/07/1976', 'Biên giới', 'B', '1', '2'],
    ],
    'Thôn Hội Xá': [
        ['Liệt sỹ', 'Ngày sinh', 'Quê quán', 'Chức vụ', 'Ngày nhập ngũ', 'Ngày hy sinh', 'Nơi hy sinh', 'Khu', 'Hàng số', 'Mộ số'],
        ['Đặng Văn F', '06/06/1955', 'Hội Xá', 'Chiến sỹ', '06/06/1973', '30/08/1977', 'Quảng Trị', 'A', '1', '1'],
        ['Vũ Văn G', '07/07/1956', 'Hội Xá', 'Chiến sỹ', '07/07/1974', '14/09/1978', 'Lào', 'A', '1', '2'],
        ['Bùi Văn H', '08/08/1957', 'Hội Xá', 'Trung đội trưởng', '08/08/1975', '22/10/1979', 'Biên giới', 'B', '1', '1'],
    ],
    'Thôn Tiên Mai': [
        ['Liệt sỹ', 'Ngày sinh', 'Quê quán', 'Chức vụ', 'Ngày nhập ngũ', 'Ngày hy sinh', 'Nơi hy sinh', 'Khu', 'Hàng số', 'Mộ số'],
        ['Đinh Văn I', '09/09/1958', 'Tiên Mai', 'Chiến sỹ', '09/09/1976', '11/11/1980', 'Quảng Bình', 'A', '1', '1'],
        ['Cao Văn J', '10/10/1959', 'Tiên Mai', 'Chiến sỹ', '10/10/1977', '05/12/1981', 'Lào', 'A', '1', '2'],
    ],
    'Thôn Phú Yên': [
        ['Liệt sỹ', 'Ngày sinh', 'Quê quán', 'Chức vụ', 'Ngày nhập ngũ', 'Ngày hy sinh', 'Nơi hy sinh', 'Khu', 'Hàng số', 'Mộ số'],
        ['Mai Văn K', '11/11/1960', 'Phú Yên', 'Chiến sỹ', '11/11/1978', '17/01/1982', 'Biên giới', 'A', '1', '1'],
        ['Lý Văn L', '12/12/1961', 'Phú Yên', 'Chiến sỹ', '12/12/1979', '28/02/1983', 'Quảng Trị', 'B', '1', '1'],
    ],
}

def get_sheets_service():
    """Khởi tạo Google Sheets service"""
    creds = Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE,
        scopes=['https://www.googleapis.com/auth/spreadsheets']
    )
    return build('sheets', 'v4', credentials=creds)

def clear_spreadsheet(service):
    """Xoá tất cả sheet hiện tại (ngoài sheet đầu tiên)"""
    try:
        spreadsheet = service.spreadsheets().get(spreadsheetId=SPREADSHEET_ID).execute()
        sheets = spreadsheet.get('sheets', [])
        
        # Xoá tất cả sheet ngoài sheet đầu tiên
        for sheet in sheets[1:]:
            request = service.spreadsheets().batchUpdate(
                spreadsheetId=SPREADSHEET_ID,
                body={'requests': [{'deleteSheet': {'sheetId': sheet['properties']['sheetId']}}]}
            ).execute()
        print(f'✓ Đã xoá {len(sheets) - 1} sheet cũ')
    except Exception as e:
        print(f'Lỗi khi xoá sheet: {e}')

def create_sheet(service, title):
    """Tạo sheet mới"""
    request = service.spreadsheets().batchUpdate(
        spreadsheetId=SPREADSHEET_ID,
        body={'requests': [{'addSheet': {'properties': {'title': title}}}]}
    ).execute()
    sheet_id = request['replies'][0]['addSheet']['properties']['sheetId']
    return sheet_id

def populate_sheet(service, sheet_title, data):
    """Điền dữ liệu vào sheet"""
    # Tạo sheet
    sheet_id = create_sheet(service, sheet_title)
    
    # Chuẩn bị request để update values
    values = data
    body = {'values': values}
    
    service.spreadsheets().values().update(
        spreadsheetId=SPREADSHEET_ID,
        range=f'{sheet_title}!A1',
        valueInputOption='RAW',
        body=body
    ).execute()
    
    # Format header
    requests = [
        {
            'repeatCell': {
                'range': {
                    'sheetId': sheet_id,
                    'rowIndex': 0,
                    'columnIndex': 0,
                    'endColumnIndex': len(data[0])
                },
                'cell': {
                    'userEnteredFormat': {
                        'backgroundColor': {'red': 0, 'green': 0.5, 'blue': 1},
                        'textFormat': {'bold': True, 'foregroundColor': {'red': 1, 'green': 1, 'blue': 1}},
                        'horizontalAlignment': 'CENTER'
                    }
                },
                'fields': 'userEnteredFormat'
            }
        }
    ]
    
    service.spreadsheets().batchUpdate(
        spreadsheetId=SPREADSHEET_ID,
        body={'requests': requests}
    ).execute()
    
    print(f'✓ Đã tạo sheet "{sheet_title}" với {len(data) - 1} liệt sỹ')

def main():
    print('🚀 Bắt đầu populate dữ liệu vào Google Sheets...\n')
    
    service = get_sheets_service()
    
    # Xoá sheet cũ
    clear_spreadsheet(service)
    
    # Tạo sheet cho mỗi thôn
    for village, data in VILLAGES_DATA.items():
        populate_sheet(service, village, data)
    
    print(f'\n✅ Hoàn tất! Dữ liệu đã được tạo trong Google Sheets')
    print(f'📊 Spreadsheet URL: https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit')

if __name__ == '__main__':
    main()
