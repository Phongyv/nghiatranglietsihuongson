interface GravesListProps {
  graves: any[];
  onSelectGrave: (grave: any) => void;
  selectedVillage: any;
}

export default function GravesList({
  graves,
  onSelectGrave,
  selectedVillage,
}: GravesListProps) {
  return (
    <div className="flex-1 overflow-y-auto flex flex-col bg-white">
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 sm:py-6 z-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {selectedVillage?.name || 'Chọn nghĩa trang'}
        </h1>
        <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
          Tổng số liệt sỹ: <span className="font-semibold">{graves.length}</span>
        </p>
      </div>

      {/* Grid of Graves */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-2 sm:px-6 py-3 sm:py-6">
          {graves.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {graves.map((grave, index) => (
                <button
                  key={grave.id}
                  onClick={() => onSelectGrave(grave)}
                  className="bg-white rounded-lg border-2 border-blue-400 hover:shadow-lg hover:scale-105 transition-all duration-200 overflow-hidden h-36 sm:h-32 flex flex-col cursor-pointer group hover:border-blue-600"
                  style={{
                    animation: 'slideUp 0.6s ease-out',
                    animationDelay: `${index * 0.05}s`,
                    animationFillMode: 'both',
                  }}
                >
                  {/* Card Header */}
                  <div className="bg-blue-100 px-2 sm:px-3 py-1 sm:py-2 flex-shrink-0">
                    <div className="text-[10px] sm:text-xs font-semibold text-gray-700 line-clamp-1">
                      Khu {grave.area || '-'} - Hàng {grave.row || '-'} - Mộ {grave.col || '-'}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 overflow-hidden flex flex-col justify-between gap-0.5">
                    <div className="flex-shrink-0">
                      <div className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-blue-800">
                        {grave.name}
                      </div>
                      {grave.birthYear && (
                        <div className="text-[10px] sm:text-xs text-gray-600 mt-0.5 line-clamp-1">
                          Sinh: {grave.birthYear}
                        </div>
                      )}
                    </div>

                    {grave.deathDate && (
                      <div className="text-[10px] sm:text-xs text-green-700 font-semibold truncate flex-shrink-0">
                        Mất: {grave.deathDate}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-base sm:text-lg">
                Chọn một nghĩa trang để xem danh sách liệt sỹ
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
