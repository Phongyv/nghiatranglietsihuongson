import Image from 'next/image';
import { useEffect } from 'react';

interface GraveModalProps {
  grave: any;
  onClose: () => void;
}

export default function GraveModal({ grave, onClose }: GraveModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-300 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Content */}
          <div className="p-5">
            {/* National Emblem */}
            <div className="flex justify-center mb-4">
              <Image
                src="/assets/emblem_of_vietnam.png"
                alt="Quốc huy"
                width={72}
                height={72}
                className="w-16 h-16"
              />
            </div>

            {/* Main Content - Certificate Style */}
            <div className="text-center mb-5">
              {/* Title and Name Row */}
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{grave.name}</h2>
              </div>

              {/* Birth Year */}
              <div className="mb-3 inline-block">
                <p className="text-sm text-gray-600"><span className="font-medium">Năm sinh:</span> <span className="font-semibold text-gray-900">{grave.birthYear || '-'}</span></p>
              </div>

              {/* Address */}
              <div className="mb-4 bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600"><span className="font-medium">Quê quán:</span> <span className="font-semibold text-gray-900">{grave.hometown || '-'}</span></p>
              </div>
            </div>

            {/* Information Grid - 2 columns */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Left Column */}
              <div className="space-y-3">
                {/* Death Date */}
                <div>
                  <p className="text-xs text-gray-600"><span className="font-medium">Ngày hy sinh:</span> <span className="font-semibold text-gray-900">{grave.deathDate || '-'}</span></p>
                </div>

                {/* Enlistment Date */}
                <div>
                  <p className="text-xs text-gray-600"><span className="font-medium">Ngày nhập ngũ:</span> <span className="font-semibold text-gray-900">{grave.enlistmentDate || '-'}</span></p>
                </div>

                {/* Position */}
                <div>
                  <p className="text-xs text-gray-600"><span className="font-medium">Chức vụ:</span> <span className="font-semibold text-gray-900">{grave.position || '-'}</span></p>
                </div>

                {/* Death Place */}
                <div>
                  <p className="text-xs text-gray-600"><span className="font-medium">Nơi hy sinh:</span> <span className="font-semibold text-gray-900">{grave.deathPlace || '-'}</span></p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-3">
                {/* Area */}
                <div>
                  <p className="text-xs text-gray-600"><span className="font-medium">Khu:</span> <span className="font-semibold text-gray-900">{grave.area ? `Khu ${grave.area}` : '-'}</span></p>
                </div>

                {/* Row */}
                <div>
                  <p className="text-xs text-gray-600"><span className="font-medium">Hàng số:</span> <span className="font-semibold text-gray-900">{grave.row || '-'}</span></p>
                </div>

                {/* Column */}
                <div>
                  <p className="text-xs text-gray-600"><span className="font-medium">Mộ số:</span> <span className="font-semibold text-gray-900">{grave.col || '-'}</span></p>
                </div>

                {/* Birth Year (Right) */}
                <div />
              </div>
            </div>

            {/* Description */}
            {grave.description && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 font-medium mb-1">Tiểu sử:</p>
                <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                  {grave.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
