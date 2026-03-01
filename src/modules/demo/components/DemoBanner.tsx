import { FiInfo, FiX } from 'react-icons/fi';
import { useState } from 'react';

export const DemoBanner = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 max-w-2xl w-full px-4">
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow-xl p-4 flex items-center gap-3">
        <FiInfo className="text-2xl flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-bold text-sm">Demo Mode Active</h3>
          <p className="text-xs opacity-90">
            You're viewing simulated data. All actions are temporary and won't affect real data.
          </p>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="text-white hover:bg-white/20 rounded p-1 transition-colors"
        >
          <FiX size={18} />
        </button>
      </div>
    </div>
  );
};
