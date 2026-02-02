import Image from 'next/image';

interface HeaderProps {
  onMenuClick?: () => void;
  onListClick?: () => void;
  onSearchClick?: () => void;
}

export default function Header({ onMenuClick, onListClick, onSearchClick }: HeaderProps) {
  return (
    <header className="bg-green-800 text-white shadow-md sticky top-0 z-20">
      <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3 sm:gap-6">
        {/* Left: Logo and Title */}
        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
          {/* Logos */}
          <div className="flex gap-2 flex-shrink-0">
            <Image
              src="/assets/logo_doi.png"
              alt="Logo Đội"
              width={36}
              height={36}
              className="w-8 sm:w-9 h-8 sm:h-9"
            />
            <Image
              src="/assets/logo_hoi.png"
              alt="Logo Hội"
              width={36}
              height={36}
              className="w-8 sm:w-9 h-8 sm:h-9"
            />
            <Image
              src="/assets/logo_doan.png"
              alt="Logo Đoàn"
              width={36}
              height={36}
              className="w-8 sm:w-9 h-8 sm:h-9"
            />
          </div>

          {/* Title */}
          <div className="min-w-0">
            <h1 className="text-lg sm:text-2xl font-bold truncate">Nghĩa Trang Liệt Sĩ Xã Hương Sơn</h1>
            <p className="text-xs sm:text-sm text-green-100 hidden sm:block">Công trình số hóa kỷ niệm liệt sỹ</p>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* List Button */}
          <button
            onClick={onListClick}
            className="hidden sm:flex items-center gap-1 px-3 py-2 rounded-lg bg-green-700 hover:bg-green-600 transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="hidden md:inline">Danh sách</span>
          </button>

          {/* Search Button */}
          <button
            onClick={onSearchClick}
            className="hidden sm:flex items-center gap-1 px-3 py-2 rounded-lg bg-green-700 hover:bg-green-600 transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="hidden md:inline">Tìm kiếm</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="sm:hidden hover:bg-green-700 p-2 rounded transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

