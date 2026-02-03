
interface AreaConfig {
  area: string;  // A, B, C, D
  rows: number;  // Số hàng
  cols: number;  // Số dãy
  totalGraves: number;
}

interface MapViewProps {
  graves: any[];
  onSelectGrave: (grave: any) => void;
  villageId: string;
  areas?: AreaConfig[];
}

export default function MapView({
  graves,
  onSelectGrave,
  villageId,
  areas = [],
}: MapViewProps) {
  // Group graves by area (khu)
  const gravesByArea = graves.reduce((acc: Record<string, any[]>, grave) => {
    const area = grave.area || 'Khác';
    if (!acc[area]) {
      acc[area] = [];
    }
    acc[area].push(grave);
    return acc;
  }, {} as Record<string, any[]>);

  // Create area config map for quick lookup
  const areaConfigMap = new Map<string, AreaConfig>();
  areas.forEach(config => {
    areaConfigMap.set(config.area, config);
  });

  // Use areas from config if available, otherwise use actual grave areas
  const displayAreas = areas.length > 0 
    ? areas.map(a => a.area).sort() 
    : Object.keys(gravesByArea).sort();

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

      {displayAreas.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {displayAreas.map((areaName, areaIndex) => {
            const areaGraves = gravesByArea[areaName] || [];
            const areaConfig = areaConfigMap.get(areaName);
            
            // Group by row (hàng)
            const gravesByRow = areaGraves.reduce((acc: Record<number, any[]>, grave) => {
              const row = grave.row || 0;
              if (!acc[row]) {
                acc[row] = [];
              }
              acc[row].push(grave);
              return acc;
            }, {} as Record<number, any[]>);

            // Generate rows based on area config
            let rows: number[] = [];
            if (areaConfig && areaConfig.rows > 0) {
              rows = Array.from({ length: areaConfig.rows }, (_, i) => i + 1);
            } else {
              rows = Object.keys(gravesByRow)
                .map(Number)
                .filter(n => n > 0)
                .sort((a, b) => a - b);
            }

            return (
              <div 
                key={areaName} 
                className="rounded-lg p-4 bg-white"
                style={{
                  animation: 'fadeIn 0.6s ease-out',
                  animationDelay: `${areaIndex * 0.1}s`,
                  animationFillMode: 'both',
                }}
              >
                {/* Area Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  Khu {areaName}
                </h3>

                {/* Rows */}
                <div className="space-y-4">
                  {rows.map((rowNum, rowIndex) => {
                    const rowGraves = gravesByRow[rowNum] || [];
                    
                    // Determine number of columns for this row
                    let numCols = areaConfig ? areaConfig.cols : 0;
                    if (numCols === 0 && rowGraves.length > 0) {
                      numCols = Math.max(...rowGraves.map((g) => g.col || 0));
                    }
                    
                    // Create a map for quick lookup
                    const graveMap = new Map();
                    rowGraves.forEach((grave) => {
                      graveMap.set(grave.col, grave);
                    });

                    return (
                      <div key={`${areaName}-row-${rowNum}`}>
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
                                  key={`${areaName}-${rowNum}-${colNum}`}
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
                                  key={`${areaName}-${rowNum}-${colNum}-empty`}
                                  onClick={() => 
                                    onSelectGrave({
                                      id: `${areaName}-${rowNum}-${colNum}`,
                                      area: areaName,
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
