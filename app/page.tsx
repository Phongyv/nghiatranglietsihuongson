'use client';

import { useEffect, useState } from 'react';
import GraveModal from './components/GraveModal';
import Header from './components/Header';
import MapView from './components/MapView';
import VillageList from './components/VillageList';

import SidebarModal from './components/SidebarModal';
interface Village {
  id: string;
  name: string;
  totalGraves: number;
  numKhu: number;
  numHang: number;
  numDay: number;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ keyword: '', area: '', row: '', col: '' });

  const [listModalOpen, setListModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  // Fetch villages on mount
  useEffect(() => {
    fetchVillages();
  }, []);

  // Fetch graves when village is selected
  useEffect(() => {
    if (selectedVillage) {
      fetchGraves(selectedVillage.id);
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
      filtered = filtered.filter((g) => g.row === parseInt(filters.row));
    }
    if (filters.col) {
      filtered = filtered.filter((g) => g.col === parseInt(filters.col));
    }

    setFilteredGraves(filtered);
  }, [graves, filters]);

  const fetchVillages = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/villages');
      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setVillages(data.data || []);
      }
    } catch (err) {
      setError('Lỗi khi tải danh sách thôn');
    } finally {
      setLoading(false);
    }
  };

  const fetchGraves = async (villageId: string) => {
    try {
      const response = await fetch(`/api/graves?villageId=${villageId}`);
      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setGraves(data.data || []);
      }
    } catch (err) {
      setError('Lỗi khi tải dữ liệu ô mộ');
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
              villageMetadata={{
                numKhu: selectedVillage?.numKhu || 0,
                numHang: selectedVillage?.numHang || 0,
                numDay: selectedVillage?.numDay || 0,
              }}
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
    </div>
  );
}
