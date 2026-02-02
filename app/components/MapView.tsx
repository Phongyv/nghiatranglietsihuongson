
interface MapViewProps {
  graves: any[];
  onSelectGrave: (grave: any) => void;
  villageId: string;
  villageMetadata?: {
    numKhu: number;
    numHang: number;
    numDay: number;
  };
}

export default function MapView({
  graves,
  onSelectGrave,
  villageId,
  villageMetadata,
}: MapViewProps) {
  // Generate area labels (A, B, C, D, ...)
  const generateAreaLabels = (numKhu: number): string[] => {
    return Array.from({ length: numKhu }, (_, i) =>
      String.fromCharCode(65 + i) // A = 65
    );
  };

  // Get area labels from metadata or from graves
  const areaLabels = villageMetadata
    ? generateAreaLabels(villageMetadata.numKhu)
    : [];

  // Group graves by area (khu)
  const gravesByArea = graves.reduce((acc, grave) => {
    const area = grave.area || 'Khác';
    if (!acc[area]) {
      acc[area] = [];
    }
    acc[area].push(grave);
    return acc;
  }, {} as Record<string, any[]>);

  // Use metadata areas if available, otherwise use actual grave areas
  const areas = villageMetadata ? areaLabels : Object.keys(gravesByArea).sort();

  return (
    <div className="bg-white rounded-lg shadow-xl p-8">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {areas.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {areas.map((area, areaIndex) => {
            const areaGraves = gravesByArea[area] || [];
            
            // Group by row (hàng)
            const gravesByRow = areaGraves.reduce((acc, grave) => {
              const row = grave.row || 0;
              if (!acc[row]) {
                acc[row] = [];
              }
              acc[row].push(grave);
              return acc;
            }, {} as Record<number, any[]>);

            // Generate rows based on metadata
            let rows: number[] = [];
            if (villageMetadata && villageMetadata.numHang > 0) {
              rows = Array.from({ length: villageMetadata.numHang }, (_, i) => i + 1);
            } else {
              rows = Object.keys(gravesByRow)
                .map(Number)
                .sort((a, b) => a - b);
            }

            return (
              <div 
                key={area} 
                className="rounded-lg p-4 bg-white"
                style={{
                  animation: 'fadeIn 0.6s ease-out',
                  animationDelay: `${areaIndex * 0.1}s`,
                  animationFillMode: 'both',
                }}
              >
                {/* Rows */}
                <div className="space-y-4">
                  {rows.map((rowNum, rowIndex) => {
                    const rowGraves = gravesByRow[rowNum] || [];
                    
                    // Determine number of columns for this row
                    let numCols = villageMetadata ? villageMetadata.numDay : 0;
                    if (numCols === 0 && rowGraves.length > 0) {
                      numCols = Math.max(...rowGraves.map((g) => g.col || 0));
                    }
                    
                    // Create a map for quick lookup
                    const graveMap = new Map();
                    rowGraves.forEach((grave) => {
                      graveMap.set(grave.col, grave);
                    });

                    return (
                      <div key={`${area}-row-${rowNum}`}>
                        {/* Graves in row - Dynamic grid based on columns */}
                        <div
                          className="grid gap-2"
                          style={{
                            gridTemplateColumns: `repeat(${numCols}, minmax(0, 1fr))`,
                          }}
                        >
                          {Array.from({ length: numCols }, (_, i) => i + 1).map((colNum, colIndex) => {
                            const grave = graveMap.get(colNum);
                            
                            if (grave && grave.name) {
                              return (
                                <button
                                  key={`${area}-${rowNum}-${colNum}`}
                                  onClick={() => onSelectGrave(grave)}
                                  className="bg-green-700 hover:bg-green-800 hover:shadow-md transition-all duration-200 border border-green-600 p-2 cursor-pointer text-center h-32 flex flex-col justify-center items-center"
                                  style={{
                                    animation: 'scaleIn 0.5s ease-out',
                                    animationDelay: `${0.3 + areaIndex * 0.1 + (rowIndex * numCols + colIndex) * 0.03}s`,
                                    animationFillMode: 'both',
                                  }}
                                >
                                  <div className="text-xs font-bold text-white leading-snug break-words">
                                    {grave.name}
                                  </div>
                                  <div className="text-[10px] text-gray-100 mt-1">
                                    {grave.birthYear && <div>{grave.birthYear}</div>}
                                  </div>
                                </button>
                              );
                            } else {
                              // Empty grave slot - also clickable
                              return (
                                <button
                                  key={`${area}-${rowNum}-${colNum}-empty`}
                                  onClick={() => 
                                    onSelectGrave({
                                      id: `${area}-${rowNum}-${colNum}`,
                                      area,
                                      row: rowNum,
                                      col: colNum,
                                      villageId,
                                      name: '',
                                    })
                                  }
                                  className="bg-green-100 border border-dashed border-green-300 p-2 h-32 hover:bg-green-200 transition-colors"
                                  style={{
                                    animation: 'scaleIn 0.5s ease-out',
                                    animationDelay: `${0.3 + areaIndex * 0.1 + (rowIndex * numCols + colIndex) * 0.03}s`,
                                    animationFillMode: 'both',
                                  }}
                                />
                              );
                            }
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p>Không có dữ liệu ô mộ</p>
        </div>
      )}

    </div>
  );
}
