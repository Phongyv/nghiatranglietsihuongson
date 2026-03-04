'use client';

import { useState } from 'react';

interface Grave {
  id: string;
  villageId: string;
  name: string;
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
}

interface GraveEditModalProps {
  grave: Grave;
  villageId: string;
  onClose: () => void;
  onUpdate: (grave: Grave) => void;
}

export default function GraveEditModal({
  grave,
  villageId,
  onClose,
  onUpdate,
}: GraveEditModalProps) {
  const [formData, setFormData] = useState<Grave>(grave);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value ? parseInt(value) : undefined,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const response = await fetch('/api/admin/graves', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          villageId,
          originalGrave: grave,
          grave: formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Lỗi khi cập nhật ô mộ');
      }

      setSuccess(true);
      onUpdate(formData);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi cập nhật ô mộ');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
          className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">Chỉnh sửa thông tin ô mộ</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Error Message */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                  Cập nhật thông tin thành công!
                </div>
              )}

              {/* Two columns layout */}
              <div className="grid grid-cols-2 gap-4">
                {/* Name */}
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Tên liệt sỹ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Birth Year */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Năm sinh
                  </label>
                  <input
                    type="text"
                    name="birthYear"
                    value={formData.birthYear || ''}
                    onChange={handleChange}
                    placeholder="VD: 1950"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Hometown */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Quê quán
                  </label>
                  <input
                    type="text"
                    name="hometown"
                    value={formData.hometown || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Position */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Chức vụ
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position || ''}
                    onChange={handleChange}
                    placeholder="VD: Chiến sỹ, Tiểu đội trưởng"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Enlistment Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Ngày nhập ngũ
                  </label>
                  <input
                    type="text"
                    name="enlistmentDate"
                    value={formData.enlistmentDate || ''}
                    onChange={handleChange}
                    placeholder="VD: 01/01/1968"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Death Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Ngày hy sinh
                  </label>
                  <input
                    type="text"
                    name="deathDate"
                    value={formData.deathDate || ''}
                    onChange={handleChange}
                    placeholder="VD: 10/05/1972"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Death Place */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Nơi hy sinh
                  </label>
                  <input
                    type="text"
                    name="deathPlace"
                    value={formData.deathPlace || ''}
                    onChange={handleChange}
                    placeholder="VD: Quảng Trị"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Area */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Khu
                  </label>
                  <input
                    type="text"
                    name="area"
                    value={formData.area || ''}
                    onChange={handleChange}
                    placeholder="VD: A, B, C"
                    maxLength={1}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Row */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Hàng số
                  </label>
                  <input
                    type="number"
                    name="row"
                    value={formData.row || ''}
                    onChange={handleNumberChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Column */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Mộ số
                  </label>
                  <input
                    type="number"
                    name="col"
                    value={formData.col || ''}
                    onChange={handleNumberChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Tiểu sử
                </label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Nhập tiểu sử của liệt sỹ..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                ></textarea>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Đang cập nhật...' : 'Cập nhật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
