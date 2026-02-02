import { useState } from 'react';

interface SidebarProps {
  villages: any[];
  selectedVillage: any | null;
  onSelectVillage: (village: any) => void;
  graves: any[];
  onFilterChange: (filters: {
    area?: string;
    row?: string;
    col?: string;
  }) => void;
}

export default function Sidebar({
  villages,
  selectedVillage,
  onSelectVillage,
  graves,
  onFilterChange,
}: SidebarProps) {
  const [activeTab, setActiveTab] = useState<'villages' | 'search'>('villages');
  const [searchFilters, setSearchFilters] = useState({
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

  return (
    <div className="w-full h-full bg-white border-r border-gray-200 overflow-y-auto flex flex-col">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 sticky top-0 bg-white">
        <button
          onClick={() => setActiveTab('villages')}
          className={`flex-1 py-3 px-3 text-center font-medium text-xs sm:text-sm transition-colors border-b-2 ${
            activeTab === 'villages'
              ? 'border-green-800 text-green-800'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Danh sách <br className="sm:hidden" />
          nghĩa trang
        </button>
        <button
          onClick={() => setActiveTab('search')}
          className={`flex-1 py-3 px-3 text-center font-medium text-xs sm:text-sm transition-colors border-b-2 ${
            activeTab === 'search'
              ? 'border-green-800 text-green-800'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Tìm <br className="sm:hidden" />
          kiếm
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Villages Tab */}
        {activeTab === 'villages' && (
          <div className="p-3 space-y-2">
            {villages.map((village) => (
              <button
                key={village.id}
                onClick={() => onSelectVillage(village)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                  selectedVillage?.id === village.id
                    ? 'bg-green-100 text-green-800 font-semibold border border-green-800'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className="font-medium">{village.name}</div>
                <div className="text-xs text-gray-600 mt-0.5">
                  {village.totalGraves || 0} liệt sỹ
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Search Tab */}
        {activeTab === 'search' && (
          <div className="p-3 space-y-3">
            {/* Filter by Khu */}
            <div>
              <label className="text-xs font-semibold text-gray-900 block mb-1.5">
                Khu
              </label>
              <select
                value={searchFilters.area}
                onChange={(e) => handleFilterChange('area', e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-green-800"
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
              <label className="text-xs font-semibold text-gray-900 block mb-1.5">
                Hàng
              </label>
              <select
                value={searchFilters.row}
                onChange={(e) => handleFilterChange('row', e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-green-800"
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
              <label className="text-xs font-semibold text-gray-900 block mb-1.5">
                Cột
              </label>
              <select
                value={searchFilters.col}
                onChange={(e) => handleFilterChange('col', e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-green-800"
              >
                <option value="">Chọn</option>
                {cols.map((col) => (
                  <option key={col} value={col}>
                    Cột {col}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded-lg font-medium transition-colors mt-2 text-sm">
              Tìm kiếm
            </button>
          </div>
        )}
      </div>
    </div>
  );}