import { useState } from 'react';

interface SidebarModalProps {
  isOpen: boolean;
  onClose: () => void;
  villages: any[];
  selectedVillage: any | null;
  onSelectVillage: (village: any) => void;
  graves: any[];
  onFilterChange: (filters: {
    keyword?: string;
    area?: string;
    row?: string;
    col?: string;
  }) => void;
  mode: 'list' | 'search';
}

export default function SidebarModal({
  isOpen,
  onClose,
  villages,
  selectedVillage,
  onSelectVillage,
  graves,
  onFilterChange,
  mode,
}: SidebarModalProps) {
  const [searchFilters, setSearchFilters] = useState({
    keyword: '',
    area: '',
    row: '',
    col: '',
  });

  // Get unique areas, rows, and columns from graves
  const areas = [...new Set(graves.map((g) => g.area))].filter(Boolean).sort();
  const rows = [...new Set(graves.map((g) => g.row))].filter(Boolean).sort((a, b) => a - b);
  const cols = [...new Set(graves.map((g) => g.col))].filter(Boolean).sort((a, b) => a - b);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...searchFilters, [key]: value };
    setSearchFilters(newFilters);
    onFilterChange(newFilters);
  };

  const filteredResults = graves.filter((g) => {
    const keyword = searchFilters.keyword.trim().toLowerCase();
    if (keyword) {
      const haystack = [g.name, g.hometown, g.position]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(keyword)) return false;
    }
    if (searchFilters.area && g.area !== searchFilters.area) return false;
    if (searchFilters.row && g.row !== parseInt(searchFilters.row)) return false;
    if (searchFilters.col && g.col !== parseInt(searchFilters.col)) return false;
    return true;
  });

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div className="fixed inset-0 z-50 flex justify-end">
        <div
          className="w-96 max-w-full bg-white shadow-2xl overflow-y-auto flex flex-col animate-in slide-in-from-right duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-green-800 text-white p-4 flex justify-between items-center border-b border-green-700">
            <h2 className="text-lg font-bold">
              {mode === 'list' ? 'Danh sách Nghĩa Trang' : 'Tìm kiếm'}
            </h2>
            <button
              onClick={onClose}
              className="hover:bg-green-700 p-2 rounded transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {mode === 'list' ? (
              <div className="p-4 space-y-2">
                {villages.map((village) => (
                  <button
                    key={village.id}
                    onClick={() => {
                      onSelectVillage(village);
                      onClose();
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors text-sm ${
                      selectedVillage?.id === village.id
                        ? 'bg-green-100 text-green-800 font-semibold border border-green-800'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <div className="font-medium">{village.name}</div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {/* Keyword */}
                <div>
                  <label className="text-sm font-semibold text-gray-900 block mb-2">
                    Từ khóa
                  </label>
                  <input
                    value={searchFilters.keyword}
                    onChange={(e) => handleFilterChange('keyword', e.target.value)}
                    placeholder="Ví dụ: Nguyễn Văn A"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-800"
                  />
                </div>

                {/* Filter Row - Khu, Hàng, Cột on same row */}
                <div className="grid grid-cols-3 gap-2">
                  {/* Filter by Khu */}
                  <div>
                    <label className="text-xs font-semibold text-gray-900 block mb-1">
                      Khu
                    </label>
                    <select
                      value={searchFilters.area}
                      onChange={(e) => handleFilterChange('area', e.target.value)}
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-green-800"
                    >
                      <option value="">Chọn</option>
                      {areas.map((area) => (
                        <option key={area} value={area}>
                          Khu {area}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Filter by Hàng */}
                  <div>
                    <label className="text-xs font-semibold text-gray-900 block mb-1">
                      Hàng
                    </label>
                    <select
                      value={searchFilters.row}
                      onChange={(e) => handleFilterChange('row', e.target.value)}
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-green-800"
                    >
                      <option value="">Chọn</option>
                      {rows.map((row) => (
                        <option key={row} value={row}>
                          Hàng {row}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Filter by Cột */}
                  <div>
                    <label className="text-xs font-semibold text-gray-900 block mb-1">
                      Cột
                    </label>
                    <select
                      value={searchFilters.col}
                      onChange={(e) => handleFilterChange('col', e.target.value)}
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-green-800"
                    >
                      <option value="">Chọn</option>
                      {cols.map((col) => (
                        <option key={col} value={col}>
                          Cột {col}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Search Button */}
                <button
                  onClick={() => onFilterChange(searchFilters)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors"
                >
                  Tìm kiếm
                </button>

                {/* Results */}
                <div className="pt-3 border-t border-gray-200 flex-1 overflow-y-auto">
                  <div className="text-sm font-semibold text-gray-900 mb-2 sticky top-0 bg-white py-2">
                    Kết quả ({filteredResults.length})
                  </div>
                  {filteredResults.length === 0 ? (
                    <div className="text-sm text-gray-600">Không tìm thấy liệt sỹ phù hợp.</div>
                  ) : (
                    <div className="space-y-2 pr-1">
                      {filteredResults.map((grave) => (
                        <div
                          key={grave.id}
                          className="border border-gray-200 rounded-lg p-2 bg-white hover:bg-blue-50 transition-colors"
                        >
                          <div className="text-xs font-semibold text-gray-900 mb-1">
                            {grave.name || 'Chưa rõ tên'}
                          </div>
                          <div className="text-[11px] text-gray-600 space-y-0.5">
                            <div>
                              <span className="font-medium">Vị trí:</span> Khu {grave.area || '-'} • Hàng {grave.row ?? '-'} • Mộ {grave.col ?? '-'}
                            </div>
                            {grave.birthYear && (
                              <div>
                                <span className="font-medium">Sinh:</span> {grave.birthYear}
                              </div>
                            )}
                            {grave.deathDate && (
                              <div>
                                <span className="font-medium">Hy sinh:</span> {grave.deathDate}
                              </div>
                            )}
                            {grave.position && (
                              <div>
                                <span className="font-medium">Chức vụ:</span> {grave.position}
                              </div>
                            )}
                            {grave.enlistmentDate && (
                              <div>
                                <span className="font-medium">Nhập ngũ:</span> {grave.enlistmentDate}
                              </div>
                            )}
                            {grave.deathPlace && (
                              <div>
                                <span className="font-medium">Nơi hy sinh:</span> {grave.deathPlace}
                              </div>
                            )}
                            {grave.hometown && (
                              <div>
                                <span className="font-medium">Quê quán:</span> {grave.hometown}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
