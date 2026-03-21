'use client';

import { useEffect, useState } from 'react';
import GraveModal from './components/GraveModal';
import Header from './components/Header';
import MapView from './components/MapView';
import VillageList from './components/VillageList';

import SidebarModal from './components/SidebarModal';

// Cache Manager with localStorage and expiry
const CacheManager = {
  set: (key: string, data: any, expiryMinutes: number) => {
    try {
      const item = {
        data,
        timestamp: Date.now(),
        expiry: expiryMinutes * 60 * 1000, // Convert to milliseconds
      };
      localStorage.setItem(key, JSON.stringify(item));
    } catch (err) {
      console.error('Cache set error:', err);
    }
  },
  
  get: (key: string) => {
    try {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) return null;
      
      const item = JSON.parse(itemStr);
      const now = Date.now();
      
      // Check if expired
      if (now - item.timestamp > item.expiry) {
        localStorage.removeItem(key);
        return null;
      }
      
      return item.data;
    } catch (err) {
      console.error('Cache get error:', err);
      return null;
    }
  },
  
  clear: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.error('Cache clear error:', err);
    }
  },
};
interface Village {
  id: string;
  name: string;
  totalGraves: number;
  numKhu: number;
  numHang: number;
  numDay: number;
}

interface AreaConfig {
  area: string;  // A, B, C, D
  rows: number;  // Số hàng
  cols: number;  // Số dãy
  totalGraves: number;
}

interface GraveInfo {
  id: string;
  villageId: string;
  name: string;
  displayName?: string;
  row: number;
  col: number;
  birthYear?: string;
  hometown?: string;
  position?: string;
  enlistmentDate?: string;
  deathDate?: string;
  deathPlace?: string;
  area?: string;
  hidden?: boolean;
  isAutoFilled?: boolean;
}

export default function Home() {
  const [villages, setVillages] = useState<Village[]>([]);
  const [selectedVillage, setSelectedVillage] = useState<Village | null>(null);
  const [graves, setGraves] = useState<GraveInfo[]>([]);
  const [filteredGraves, setFilteredGraves] = useState<GraveInfo[]>([]);
  const [hiddenGraveSlots, setHiddenGraveSlots] = useState<string[]>([]);
  const [selectedGrave, setSelectedGrave] = useState<GraveInfo | null>(null);
  const [areas, setAreas] = useState<AreaConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{
    keyword?: string;
    area?: string;
    row?: string;
    col?: string;
  }>({ keyword: '', area: '', row: '', col: '' });

  const [listModalOpen, setListModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const backToVillageList = () => {
    setSelectedVillage(null);
    setSelectedGrave(null);
    setListModalOpen(false);
    setSearchModalOpen(false);
    setMobileMenuOpen(false);
    setFilters({ keyword: '', area: '', row: '', col: '' });
  };

  // Initialize view state in browser history
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const currentState = window.history.state || {};
    if (currentState.appView !== 'villages' && currentState.appView !== 'graves') {
      window.history.replaceState({ ...currentState, appView: 'villages' }, '');
    }
  }, []);

  // Sync UI state to browser history so back button returns from graves to villages
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const currentState = window.history.state || {};
    if (selectedVillage) {
      if (currentState.appView === 'graves') {
        window.history.replaceState(
          { ...currentState, appView: 'graves', villageId: selectedVillage.id },
          ''
        );
      } else {
        window.history.pushState(
          { ...currentState, appView: 'graves', villageId: selectedVillage.id },
          ''
        );
      }
      return;
    }

    if (currentState.appView !== 'villages') {
      window.history.replaceState({ ...currentState, appView: 'villages' }, '');
    }
  }, [selectedVillage]);

  // Handle browser back/forward navigation between villages view and graves view
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const nextView = event.state?.appView;
      const villageId = event.state?.villageId;

      if (nextView === 'graves') {
        if (!selectedVillage && villageId) {
          const village = villages.find((v) => v.id === villageId);
          if (village) {
            setSelectedVillage(village);
          }
        }
        return;
      }

      if (selectedVillage) {
        backToVillageList();
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [selectedVillage, villages]);

  // Fetch villages on mount
  useEffect(() => {
    fetchVillages();
  }, []);

  // Fetch graves and areas when village is selected
  useEffect(() => {
    if (selectedVillage) {
      fetchGraves(selectedVillage.id);
      fetchAreas(selectedVillage.id);
    }
  }, [selectedVillage]);

  // Filter graves based on filters
  useEffect(() => {
    let filtered = graves;

    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase().trim();
      if (keyword) {
        filtered = filtered.filter((g) =>
          [g.name, g.hometown, g.position]
            .filter(Boolean)
            .some((v) => String(v).toLowerCase().includes(keyword))
        );
      }
    }
    if (filters.area) {
      filtered = filtered.filter((g) => g.area === filters.area);
    }
    if (filters.row) {
      filtered = filtered.filter((g) => g.row === parseInt(filters.row || ''));
    }
    if (filters.col) {
      filtered = filtered.filter((g) => g.col === parseInt(filters.col || ''));
    }

    setFilteredGraves(filtered);
  }, [graves, filters]);

  const fetchVillages = async () => {
    // Check cache first (10 minutes)
    const cacheKey = 'villages';
    const cachedData = CacheManager.get(cacheKey);
    if (cachedData) {
      setVillages(cachedData);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch('/api/villages');
      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        const villagesData = data.data || [];
        setVillages(villagesData);
        CacheManager.set(cacheKey, villagesData, 0); // Cache disabled - 0 minutes
      }
    } catch (err) {
      setError('Lỗi khi tải danh sách thôn');
    } finally {
      setLoading(false);
    }
  };

  const fetchGraves = async (villageId: string) => {
    try {
      const response = await fetch(`/api/graves?villageId=${villageId}&includeHidden=true`);
      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        const allGravesData: GraveInfo[] = data.data || [];
        const visibleGravesData = allGravesData.filter(
          (grave) => !grave.hidden && !grave.isAutoFilled
        );
        const hiddenSlots = allGravesData
          .filter((grave) => grave.hidden && grave.area && grave.row && grave.col)
          .map((grave) => `${grave.area}|${grave.row}|${grave.col}`);

        setGraves(visibleGravesData);
        setHiddenGraveSlots(hiddenSlots);
      }
    } catch (err) {
      setError('Lỗi khi tải dữ liệu ô mộ');
    }
  };

  const fetchAreas = async (villageId: string) => {
    // Check cache first (5 minutes)
    const cacheKey = `areas_${villageId}`;
    const cachedData = CacheManager.get(cacheKey);
    if (cachedData) {
      setAreas(cachedData);
      return;
    }

    try {
      const response = await fetch(`/api/areas?villageId=${villageId}`);
      const data = await response.json();

      if (data.error) {
        console.error('Error fetching areas:', data.error);
        setAreas([]);
      } else {
        const areasData = data.data || [];
        setAreas(areasData);
        CacheManager.set(cacheKey, areasData, 0); // Cache disabled - 0 minutes
      }
    } catch (err) {
      console.error('Error fetching areas:', err);
      setAreas([]);
    }
  };

  // View: Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800 mx-auto mb-4"></div>
          <p className="text-gray-700">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // View: Error
  if (error && villages.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full border border-green-200">
          <h2 className="text-2xl font-bold text-green-800 mb-4">Lỗi</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={fetchVillages}
            className="w-full bg-green-800 hover:bg-green-700 text-white py-2 rounded-lg transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // View: Village List (Home Page)
  if (!selectedVillage) {
    return (
      <VillageList
        villages={villages}
        onSelectVillage={setSelectedVillage}
        loading={loading}
      />
    );
  }

  // View: Main Layout
  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <Header
        onListClick={() => setListModalOpen(true)}
        onSearchClick={() => setSearchModalOpen(true)}
        onMenuClick={() => setMobileMenuOpen(true)}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Map View */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div
            className="flex-1 overflow-auto"
            style={{
              backgroundImage: "url('/assets/elementry-background.jpg')",
              backgroundSize: 'cover',
              backgroundAttachment: 'fixed',
              backgroundPosition: 'center',
            }}
          >
            <MapView
              graves={filteredGraves}
              onSelectGrave={setSelectedGrave}
              villageId={selectedVillage?.id || ''}
              areas={areas}
              hiddenGraveSlots={hiddenGraveSlots}
            />
          </div>
        </div>

        {/* Floating Action Buttons - right side */}
        <div className="absolute right-4 top-4 z-10 flex flex-col gap-2">
          <button
            onClick={() => setListModalOpen(true)}
            className="w-10 h-10 bg-white rounded-lg shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            title="Danh sách"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <button
            onClick={() => setSearchModalOpen(true)}
            className="w-10 h-10 bg-white rounded-lg shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            title="Tìm kiếm"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Grave Modal */}
      {selectedGrave && (
        <GraveModal
          grave={selectedGrave}
          onClose={() => setSelectedGrave(null)}
        />
      )}

      {/* List Modal */}
      <SidebarModal
        isOpen={listModalOpen}
        onClose={() => setListModalOpen(false)}
        villages={villages}
        selectedVillage={selectedVillage}
        onSelectVillage={setSelectedVillage}
        graves={graves}
        onFilterChange={setFilters}
        mode="list"
      />

      {/* Search Modal */}
      <SidebarModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        villages={villages}
        selectedVillage={selectedVillage}
        onSelectVillage={setSelectedVillage}
        graves={graves}
        onFilterChange={setFilters}
        mode="search"
      />

      {/* Mobile Menu Modal */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Sidebar */}
          <div 
            className="absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ease-out"
            style={{
              animation: 'slideInRight 0.3s ease-out',
            }}
          >
            <style>{`
              @keyframes slideInRight {
                from {
                  transform: translateX(100%);
                }
                to {
                  transform: translateX(0);
                }
              }
            `}</style>
            
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-green-800 text-white">
              <h3 className="text-lg font-bold">Menu</h3>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 hover:bg-green-700 rounded transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Menu Items */}
            <div className="p-4 space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setListModalOpen(true);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors text-left"
              >
                <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span className="text-gray-900 font-medium">Danh sách</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSearchModalOpen(true);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors text-left"
              >
                <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-gray-900 font-medium">Tìm kiếm</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
