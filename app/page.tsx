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
  row: number;
  col: number;
  birthYear?: string;
  hometown?: string;
  position?: string;
  enlistmentDate?: string;
  deathDate?: string;
  deathPlace?: string;
  area?: string;
}

export default function Home() {
  const [villages, setVillages] = useState<Village[]>([]);
  const [selectedVillage, setSelectedVillage] = useState<Village | null>(null);
  const [graves, setGraves] = useState<GraveInfo[]>([]);
  const [filteredGraves, setFilteredGraves] = useState<GraveInfo[]>([]);
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
        CacheManager.set(cacheKey, villagesData, 10); // Cache for 10 minutes
      }
    } catch (err) {
      setError('Lỗi khi tải danh sách thôn');
    } finally {
      setLoading(false);
    }
  };

  const fetchGraves = async (villageId: string) => {
    // Check cache first (5 minutes)
    const cacheKey = `graves_${villageId}`;
    const cachedData = CacheManager.get(cacheKey);
    if (cachedData) {
      setGraves(cachedData);
      return;
    }

    try {
      const response = await fetch(`/api/graves?villageId=${villageId}`);
      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        const gravesData = data.data || [];
        setGraves(gravesData);
        CacheManager.set(cacheKey, gravesData, 5); // Cache for 5 minutes
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
        CacheManager.set(cacheKey, areasData, 5); // Cache for 5 minutes
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
      <div className="flex flex-1 overflow-hidden">
        {/* Map View */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-gray-200 bg-white flex items-start justify-between gap-4">
            <button
              onClick={() => {
                setSelectedVillage(null);
                setSelectedGrave(null);
              }}
              className="flex items-center gap-2 text-green-800 hover:text-green-900 font-medium text-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Quay lại
            </button>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-right">
              {selectedVillage?.name}
            </h1>
          </div>

          <div className="flex-1 overflow-auto">
            <MapView
              graves={filteredGraves}
              onSelectGrave={setSelectedGrave}
              villageId={selectedVillage?.id || ''}
              areas={areas}
            />
          </div>
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
