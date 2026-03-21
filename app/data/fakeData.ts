export const fakeVillages = [
  { id: 'Thôn Đức Khê', name: 'Thôn Đức Khê', graveCount: 100 },
  { id: 'Thôn Yên Vỹ', name: 'Thôn Yên Vỹ', graveCount: 38 },
  { id: 'Thôn Hội Xá', name: 'Thôn Hội Xá', graveCount: 52 },
  { id: 'Thôn Tiên Mai', name: 'Thôn Tiên Mai', graveCount: 41 },
  { id: 'Thôn Phú Yên', name: 'Thôn Phú Yên', graveCount: 33 },
];

const generateGraveData = (area: string, startName: string) => {
  const names = [
    `${startName} 1`, `${startName} 2`, `${startName} 3`, `${startName} 4`, `${startName} 5`,
    `${startName} 6`, `${startName} 7`, `${startName} 8`, `${startName} 9`, `${startName} 10`,
    `${startName} 11`, `${startName} 12`, `${startName} 13`, `${startName} 14`, `${startName} 15`,
    `${startName} 16`, `${startName} 17`, `${startName} 18`, `${startName} 19`, `${startName} 20`,
    `${startName} 21`, `${startName} 22`, `${startName} 23`, `${startName} 24`, `${startName} 25`,
  ];
  
  const graves = [];
  let nameIndex = 0;
  
  // 5 hàng × 5 cột = 25 ô, nhưng chỉ có ~18 liệt sỹ để có những ô trống
  for (let row = 1; row <= 5; row++) {
    for (let col = 1; col <= 5; col++) {
      // Bỏ qua một số vị trí để tạo ô trống
      if ((row === 3 && col === 3) || (row === 4 && col === 2) || (row === 5 && col === 4)) {
        continue; // Skip để tạo ô trống
      }
      
      graves.push({
        name: names[nameIndex],
        birthYear: `195${Math.floor(Math.random() * 10)}`,
        hometown: 'Đức Khê',
        position: 'Chiến sỹ',
        enlistmentDate: `${Math.floor(Math.random() * 12) + 1}/${Math.floor(Math.random() * 28) + 1}/1968`,
        deathDate: `${Math.floor(Math.random() * 28) + 1}/${Math.floor(Math.random() * 12) + 1}/197${Math.floor(Math.random() * 3)}`,
        deathPlace: 'Quảng Trị',
        area: area,
        row: row,
        col: col,
      });
      nameIndex++;
    }
  }
  
  return graves;
};

export const fakeGraves: Record<string, any[]> = {
  'Thôn Đức Khê': [
    // Khu A - 5 hàng × 5 cột
    ...generateGraveData('A', 'Liệt sỹ Khu A'),
    // Khu B - 5 hàng × 5 cột
    ...generateGraveData('B', 'Liệt sỹ Khu B'),
    // Khu C - 5 hàng × 5 cột
    ...generateGraveData('C', 'Liệt sỹ Khu C'),
    // Khu D - 5 hàng × 5 cột
    ...generateGraveData('D', 'Liệt sỹ Khu D'),
  ],
  
  'Thôn Yên Vỹ': [
    { name: 'Nguyễn Văn A', birthYear: '1950', hometown: 'Yên Vỹ', position: 'Chiến sỹ', enlistmentDate: '01/01/1968', deathDate: '15/03/1972', deathPlace: 'Quảng Trị', area: 'A', row: 1, col: 1 },
    { name: 'Trần Văn B', birthYear: '1951', hometown: 'Yên Vỹ', position: 'Chiến sỹ', enlistmentDate: '02/02/1969', deathDate: '20/04/1973', deathPlace: 'Quảng Bình', area: 'A', row: 1, col: 2 },
    { name: 'Lê Văn C', birthYear: '1952', hometown: 'Yên Vỹ', position: 'Tiểu đội trưởng', enlistmentDate: '03/03/1970', deathDate: '12/05/1974', deathPlace: 'Lào', area: 'A', row: 1, col: 3 },
    { name: 'Phạm Văn D', birthYear: '1953', hometown: 'Yên Vỹ', position: 'Chiến sỹ', enlistmentDate: '04/04/1971', deathDate: '18/06/1975', deathPlace: 'Campuchia', area: 'B', row: 1, col: 1 },
    { name: 'Hoàng Văn E', birthYear: '1954', hometown: 'Yên Vỹ', position: 'Chiến sỹ', enlistmentDate: '05/05/1972', deathDate: '25/07/1976', deathPlace: 'Biên giới', area: 'B', row: 1, col: 2 },
  ],

  'Thôn Hội Xá': [
    { name: 'Đặng Văn F', birthYear: '1955', hometown: 'Hội Xá', position: 'Chiến sỹ', enlistmentDate: '06/06/1973', deathDate: '30/08/1977', deathPlace: 'Quảng Trị', area: 'A', row: 1, col: 1 },
    { name: 'Vũ Văn G', birthYear: '1956', hometown: 'Hội Xá', position: 'Chiến sỹ', enlistmentDate: '07/07/1974', deathDate: '14/09/1978', deathPlace: 'Lào', area: 'A', row: 1, col: 2 },
    { name: 'Bùi Văn H', birthYear: '1957', hometown: 'Hội Xá', position: 'Trung đội trưởng', enlistmentDate: '08/08/1975', deathDate: '22/10/1979', deathPlace: 'Biên giới', area: 'B', row: 1, col: 1 },
  ],

  'Thôn Tiên Mai': [
    { name: 'Đinh Văn I', birthYear: '1958', hometown: 'Tiên Mai', position: 'Chiến sỹ', enlistmentDate: '09/09/1976', deathDate: '11/11/1980', deathPlace: 'Quảng Bình', area: 'A', row: 1, col: 1 },
    { name: 'Cao Văn J', birthYear: '1959', hometown: 'Tiên Mai', position: 'Chiến sỹ', enlistmentDate: '10/10/1977', deathDate: '05/12/1981', deathPlace: 'Lào', area: 'A', row: 1, col: 2 },
  ],

  'Thôn Phú Yên': [
    { name: 'Mai Văn K', birthYear: '1960', hometown: 'Phú Yên', position: 'Chiến sỹ', enlistmentDate: '11/11/1978', deathDate: '17/01/1982', deathPlace: 'Biên giới', area: 'A', row: 1, col: 1 },
    { name: 'Lý Văn L', birthYear: '1961', hometown: 'Phú Yên', position: 'Chiến sỹ', enlistmentDate: '12/12/1979', deathDate: '28/02/1983', deathPlace: 'Quảng Trị', area: 'B', row: 1, col: 1 },
  ],
};
