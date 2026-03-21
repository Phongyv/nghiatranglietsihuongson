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
    <div className="min-h-screen bg-blue-950 text-white overflow-hidden">
      <div className="relative min-h-screen flex flex-col items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/home-banner.jpg"
            alt="Nghĩa trang liệt sĩ"
            fill
            className="object-cover"
            style={{ objectPosition: 'center bottom' }}
            priority
          />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 w-full flex flex-col items-center px-4 pt-10 sm:pt-12 pb-10">
          
          {/* Logos */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 animate-fade-in">
            <Image
              src="/assets/logo_doan.png"
              alt="Logo Đoàn"
              width={72}
              height={72}
              className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
            />
            <Image
              src="/assets/logo_hoi.png"
              alt="Logo Hội"
              width={72}
              height={72}
              className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
            />
            <Image
              src="/assets/logo_doi.png"
              alt="Logo Đội"
              width={72}
              height={72}
              className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
            />
          </div>
          
          <p className="mt-2 text-xs sm:text-sm font-bold tracking-[0.2em] uppercase drop-shadow-md animate-fade-in">
            Xã Hương Sơn
          </p>

          {/* Titles */}
          <div className="mt-6 sm:mt-8 text-center animate-slide-down flex flex-col items-center">
            <h1 
              className="text-3xl sm:text-4xl font-black uppercase text-[#d32f2f] tracking-widest mb-1"
              style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
            >
              Công Trình
            </h1>
            <p className="text-base sm:text-lg font-bold uppercase text-white tracking-widest drop-shadow-md mt-1">
              Số Hóa Nghĩa Trang Liệt Sĩ
            </p>
          </div>

          {/* List Container - Using fieldset for the line-break text effect */}
          <div className="mt-6 sm:mt-8 w-full max-w-md sm:max-w-lg px-4 animate-fade-in">
            <fieldset className="border-[2px] border-white/70 rounded-2xl px-3 sm:px-5 pb-5 pt-2 w-full">
              <legend className="text-center px-3 text-xs sm:text-sm font-bold uppercase italic text-[#ffeb3b] drop-shadow-md mx-auto">
                Các nghĩa trang liệt sĩ
              </legend>

              {loading ?
                <div className="py-4 text-center text-xs sm:text-sm font-semibold text-white drop-shadow-md">
                  Đang tải dữ liệu...
                </div>
              : villages.length > 0 ? (
                <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 sm:gap-x-4 sm:gap-y-3 mt-2">
                  {villages.map((village, index) => (
                    <button
                      key={village.id}
                      onClick={() => onSelectVillage(village)}
                      className="h-9 sm:h-10 rounded-lg border-[1.5px] border-white/70 bg-transparent text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider hover:bg-white/20 transition-all animate-scale-in drop-shadow-md flex items-center justify-center px-2"
                      style={{ animationDelay: `${0.1 + index * 0.06}s` }}
                    >
                      {village.name}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-4 text-center text-xs sm:text-sm font-semibold text-white drop-shadow-md">
                  Không có dữ liệu thôn
                </div>
              )}
            </fieldset>
          </div>
          
        </div>
      </div>
    </div>
  );
}