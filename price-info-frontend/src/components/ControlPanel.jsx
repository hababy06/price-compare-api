import React from 'react';
import { FaTh, FaList } from 'react-icons/fa';

const ControlPanel = ({ view, setView, sortBy, setSortBy }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* 左側：檢視模式切換 */}
        <div className="flex items-center space-x-2">
          <span className="text-gray-700 font-medium">檢視模式:</span>
          <button
            onClick={() => setView('grid')}
            className={`p-2 rounded-lg transition-all duration-200 ${
              view === 'grid' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            <FaTh className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-2 rounded-lg transition-all duration-200 ${
              view === 'list' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            <FaList className="h-4 w-4" />
          </button>
        </div>

        {/* 右側：排序按鈕 */}
        <div className="flex items-center space-x-4">
          {/* 排序 */}
          <div className="flex items-center space-x-2">
            <span className="text-gray-700 font-medium">排序:</span>
            <button
              onClick={() => setSortBy(prev => prev === 'report' ? 'price' : 'report')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                sortBy === 'price'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {sortBy === 'price' ? '按價格排序' : '按回報數排序'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel; 