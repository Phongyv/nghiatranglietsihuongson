'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import GraveEditModal from '../components/GraveEditModal';
import MapView from '../components/MapView';

interface Village {
  id: string;
  name: string;
}

interface Grave {
  id: string;
  villageId: string;
  name: string;
  displayName?: string;
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
  isAutoFilled?: boolean;
}

interface AreaConfig {
  area: string;
  rows: number;
  cols: number;
  totalGraves: number;
}

export default function AdminPage() {
  const router = useRouter();
  const [villages, setVillages] = useState<Village[]>([]);
  const [selectedVillage, setSelectedVillage] = useState<Village | null>(null);
  const [graves, setGraves] = useState<Grave[]>([]);
  const [filteredGraves, setFilteredGraves] = useState<Grave[]>([]);
  const [areas, setAreas] = useState<AreaConfig[]>([]);
  const [selectedGrave, setSelectedGrave] = useState<Grave | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  // Function to fetch graves and areas
  const fetchGravesAndAreas = async (villageId: string) => {
    try {
      setLoading(true);
      const [gravesResponse, areasResponse] = await Promise.all([
        fetch(`/api/graves?villageId=${villageId}&includeHidden=true`),
        fetch(`/api/areas?villageId=${villageId}`)
      ]);
      
      const gravesData = await gravesResponse.json();
      const areasData = await areasResponse.json();
      
      if (gravesData.data) {
        setGraves(gravesData.data);
        setFilteredGraves(gravesData.data);
      }
      
      if (areasData.data) {
        setAreas(areasData.data);
      }
      
      return true;
    } catch (err) {
      setError('Lỗi khi tải danh sách ô mộ');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fetch villages on mount
  useEffect(() => {
    const fetchVillages = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/villages');
        const data = await response.json();
        if (data.success) {
          setVillages(data.data);
        }
      } catch (err) {
        setError('Lỗi khi tải danh sách thôn');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVillages();
  }, []);

  // Fetch graves when village changes
  useEffect(() => {
    if (!selectedVillage) {
      setGraves([]);
      setFilteredGraves([]);
      setAreas([]);
      return;
    }
    
    fetchGravesAndAreas(selectedVillage.id);
  }, [selectedVillage]);

  // Filter graves based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredGraves(graves);
      return;
    }

    const keyword = searchTerm.toLowerCase();
    setFilteredGraves(
      graves.filter((grave) =>
        (grave.name || grave.displayName || '').toLowerCase().includes(keyword) ||
        grave.area?.includes(keyword)
      )
    );
  }, [searchTerm, graves]);

  const handleGraveUpdate = async (updatedGrave: Grave) => {
    setSelectedGrave(null);
    // Refetch graves to show updated data immediately
    if (selectedVillage) {
      await fetchGravesAndAreas(selectedVillage.id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-green-800 bg-[url('/assets/nav-back.jpg')] bg-cover bg-center text-white shadow-md sticky top-0 z-20">
        <div className="bg-black/10 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3 sm:gap-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold drop-shadow-md">Quản lý ô mộ</h1>
              <p className="text-xs sm:text-sm text-green-50 drop-shadow-md">Bấm vào ô mộ để chỉnh sửa thông tin</p>
            </div>
          </div>

          {/* View Mode Toggle */}
          {selectedVillage && (
            <div className="flex items-center gap-2 bg-white/20 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 sm:px-4 py-1 sm:py-2 rounded text-sm font-medium transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-green-800'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Lưới
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 sm:px-4 py-1 sm:py-2 rounded text-sm font-medium transition-colors ${
                  viewMode === 'map'
                    ? 'bg-white text-green-800'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Bản đồ
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md overflow-y-auto border-r border-gray-200">
          <div className="sticky top-0 bg-gray-50 border-b border-gray-200 p-4">
            <h2 className="text-lg font-bold text-gray-900">Danh sách thôn</h2>
          </div>
          
          {loading && !selectedVillage ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {villages.map((village) => (
                <button
                  key={village.id}
                  onClick={() => {
                    setSelectedVillage(village);
                    setSearchTerm('');
                  }}
                  className={`w-full text-left px-4 py-3 transition-colors font-medium ${
                    selectedVillage?.id === village.id
                      ? 'bg-green-100 text-green-900 border-l-4 border-green-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {village.name}
                </button>
              ))}
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden flex flex-col">
          {selectedVillage ? (
            <>
              {viewMode === 'map' ? (
                /* Map View */
                <div
                  className="flex-1 overflow-y-auto flex flex-col"
                  style={{
                    backgroundImage: "url('/assets/elementry-background.jpg')",
                    backgroundSize: 'cover',
                    backgroundAttachment: 'fixed',
                    backgroundPosition: 'center',
                  }}
                >
                  {/* Header */}
                  <div
                    className="sticky top-0 border-b border-gray-200 px-4 sm:px-6 py-4 sm:py-6 z-10"
                    style={{ backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)' }}
                  >
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                      {selectedVillage.name}
                    </h1>
                    
                    {/* Search Bar */}
                    <div className="relative">
                      <svg
                        className="absolute left-3 top-3 w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <input
                        type="text"
                        placeholder="Tìm kiếm theo tên hoặc khu..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <p className="text-gray-600 mt-3 text-sm sm:text-base">
                      Tổng số ô mộ: <span className="font-semibold">{graves.length}</span>
                      <span className="mx-2">•</span>
                      Đang ẩn: <span className="font-semibold text-amber-700">{graves.filter((g) => g.hidden).length}</span>
                    </p>
                  </div>

                  {/* Map Content */}
                  {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
                    </div>
                  ) : (
                    <MapView
                      graves={filteredGraves}
                      onSelectGrave={setSelectedGrave}
                      villageId={selectedVillage.id}
                      areas={areas}
                    />
                  )}
                </div>
              ) : (
                /* Grid View */
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
                  <div
                    className="sticky top-0 border-b border-gray-200 px-4 sm:px-6 py-4 sm:py-6 z-10"
                    style={{ backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)' }}
                  >
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                      {selectedVillage.name}
                    </h1>
                    
                    {/* Search Bar */}
                    <div className="relative">
                      <svg
                        className="absolute left-3 top-3 w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <input
                        type="text"
                        placeholder="Tìm kiếm theo tên hoặc khu..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <p className="text-gray-600 mt-3 text-sm sm:text-base">
                      Tổng số ô mộ: <span className="font-semibold">{filteredGraves.length}</span>
                      <span className="mx-2">•</span>
                      Đang ẩn: <span className="font-semibold text-amber-700">{filteredGraves.filter((g) => g.hidden).length}</span>
                    </p>
                  </div>

                  {/* Grid of Graves */}
                  <div className="flex-1 overflow-y-auto">
                    <div className="px-2 sm:px-6 py-3 sm:py-6">
                      {loading ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
                        </div>
                      ) : filteredGraves.length > 0 ? (
                        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-2 sm:gap-3">
                          {filteredGraves.map((grave, index) => (
                            <button
                              key={grave.id}
                              onClick={() => setSelectedGrave(grave)}
                              className="hover:shadow-lg transition-all duration-200 overflow-hidden h-20 sm:h-24 flex flex-col justify-center items-center cursor-pointer group p-1.5 sm:p-2 border-2 border-white"
                              style={{
                                backgroundColor: grave.hidden ? '#9CA3AF' : '#66A1D1',
                                animation: 'slideUp 0.6s ease-out',
                                animationDelay: `${index * 0.02}s`,
                                animationFillMode: 'both',
                              }}
                            >
                              <div className="text-[10px] sm:text-xs font-bold text-black leading-tight text-center line-clamp-2">
                                {grave.name || grave.displayName || 'Ô trống'}
                              </div>
                              {grave.birthYear && (
                                <div className="text-[8px] sm:text-[10px] text-black mt-0.5 text-center">
                                  {grave.birthYear}
                                </div>
                              )}
                              {grave.hidden && (
                                <div className="text-[8px] sm:text-[10px] font-semibold text-white bg-black/40 px-1.5 py-0.5 rounded mt-1">
                                  ĐÃ ẨN
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <p className="text-gray-600 text-base sm:text-lg">
                            {graves.length === 0 ? 'Không có ô mộ nào' : 'Không tìm thấy ô mộ'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500 text-lg">Chọn một thôn để xem danh sách ô mộ</p>
            </div>
          )}
        </main>
      </div>

      {/* Edit Modal */}
      {selectedGrave && selectedVillage && (
        <GraveEditModal
          grave={selectedGrave}
          villageId={selectedVillage.id}
          onClose={() => setSelectedGrave(null)}
          onUpdate={handleGraveUpdate}
        />
      )}

      {/* Error Alert */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
}
