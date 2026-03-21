import Image from 'next/image';

interface HeaderProps {
  onMenuClick?: () => void;
  onListClick?: () => void;
  onSearchClick?: () => void;
}

export default function Header({ onMenuClick, onListClick, onSearchClick }: HeaderProps) {
  return (
    <header className="bg-green-800 bg-[url('/assets/nav-back.jpg')] bg-cover bg-center text-white shadow-md sticky top-0 z-20">
      {/* Thêm lớp nền mờ (overlay) đen/xanh mỏng để text dễ đọc hơn trên nền hoa văn */}
      <div className="bg-black/10 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3 sm:gap-6">
        
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
            <h1 className="text-lg sm:text-2xl font-bold truncate drop-shadow-md">
              Nghĩa Trang Liệt Sĩ Xã Hương Sơn
            </h1>
            <p className="text-xs sm:text-sm text-green-50 hidden sm:block drop-shadow-md">
              Công trình số hóa kỷ niệm liệt sỹ
            </p>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
        </div>
      </div>
    </header>
  );
}