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
    <div
      className="flex-1 overflow-y-auto flex flex-col"
      style={{
        backgroundImage: "url('/assets/elementry-background.jpg')",
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
      }}
    >
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      {/* Header */}
      <div className="sticky top-0 border-b border-gray-200 px-4 sm:px-6 py-4 sm:py-6 z-10" style={{ backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)' }}>
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
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-2 sm:gap-3">
              {graves.map((grave, index) => (
                <button
                  key={grave.id}
                  onClick={() => onSelectGrave(grave)}
                  className="hover:shadow-lg transition-all duration-200 overflow-hidden h-20 sm:h-24 flex flex-col justify-center items-center cursor-pointer group p-1.5 sm:p-2 border-2 border-white"
                  style={{
                    backgroundColor: '#66A1D1',
                    animation: 'slideUp 0.6s ease-out',
                    animationDelay: `${index * 0.02}s`,
                    animationFillMode: 'both',
                  }}
                >
                  <div className="text-[10px] sm:text-xs font-bold text-black leading-tight text-center line-clamp-2">
                    {grave.name}
                  </div>
                  {grave.birthYear && (
                    <div className="text-[8px] sm:text-[10px] text-black mt-0.5 text-center">
                      {grave.birthYear}
                    </div>
                  )}
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
