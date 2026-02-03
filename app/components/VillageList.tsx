import Image from 'next/image';

interface VillageListProps {
  villages: any[];
  onSelectVillage: (village: any) => void;
  loading: boolean;
}

export default function VillageList({
  villages,
  onSelectVillage,
  loading,
}: VillageListProps) {
  return (
    <div className="min-h-screen bg-gray-900">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
      {/* Fullscreen Background */}
      <div className="relative min-h-screen text-white">
        <div className="absolute inset-0">
          <Image
            src="/assets/image.jpg"
            alt="Nghĩa trang liệt sĩ Hương Sơn"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-green-900/60" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 min-h-screen flex flex-col">
          {/* Logos */}
          <div className="flex items-center justify-center gap-4 sm:gap-8 mb-6">
            <Image
              src="/assets/logo_doi.png"
              alt="Logo Đội"
              width={60}
              height={60}
              className="w-12 sm:w-16 h-12 sm:h-16"
              style={{
                animation: 'fadeIn 0.6s ease-out',
                animationDelay: '0s',
                animationFillMode: 'both',
              }}
            />
            <Image
              src="/assets/logo_hoi.png"
              alt="Logo Hội"
              width={60}
              height={60}
              className="w-12 sm:w-16 h-12 sm:h-16"
              style={{
                animation: 'fadeIn 0.6s ease-out',
                animationDelay: '0.1s',
                animationFillMode: 'both',
              }}
            />
            <Image
              src="/assets/logo_doan.png"
              alt="Logo Đoàn"
              width={60}
              height={60}
              className="w-12 sm:w-16 h-12 sm:h-16"
              style={{
                animation: 'fadeIn 0.6s ease-out',
                animationDelay: '0.2s',
                animationFillMode: 'both',
              }}
            />
          </div>

          {/* Title and Subtitle */}
          <div className="text-center">
            <h1
              className="text-3xl sm:text-5xl font-bold mb-2 sm:mb-4"
              style={{
                animation: 'slideDown 0.7s ease-out',
              }}
            >
              Nghĩa Trang Liệt Sĩ Xã Hương Sơn
            </h1>
            <p
              className="text-base sm:text-lg text-green-100"
              style={{
                animation: 'fadeIn 0.6s ease-out',
                animationDelay: '0.2s',
                animationFillMode: 'both',
              }}
            >
              Công trình số hóa kỷ niệm liệt sỹ
            </p>
            {/* <p
              className="text-sm sm:text-base text-green-100 mt-2"
              style={{
                animation: 'fadeIn 0.6s ease-out',
                animationDelay: '0.3s',
                animationFillMode: 'both',
              }}
            >
              Lưu giữ danh tích các anh hùng vì nước vì dân
            </p> */}
          </div>

          {/* Village Tiles */}
          <div
            style={{
              animation: 'fadeIn 0.6s ease-out',
              animationDelay: '0.4s',
              animationFillMode: 'both',
            }}
            className="mt-10 sm:mt-14"
          >
            {villages.length > 0 ? (
              <div className="grid justify-center gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                {villages.map((village, index) => (
                  <button
                    key={village.id}
                    onClick={() => onSelectVillage(village)}
                    className="w-full px-3 sm:px-8 py-3 sm:py-3 rounded-lg bg-white text-green-800 font-semibold shadow-md hover:bg-green-50 hover:shadow-lg hover:scale-105 transition-all text-sm sm:text-base leading-tight"
                    style={{
                      animation: 'scaleIn 0.5s ease-out',
                      animationDelay: `${0.5 + index * 0.08}s`,
                      animationFillMode: 'both',
                    }}
                  >
                    {village.name}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-lg text-green-100">Không có dữ liệu thôn</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
