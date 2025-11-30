import { FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import { useDemoMode } from '../hooks/useDemoMode';

export const DemoModeToggle = () => {
  const { isDemoMode, toggleDemo } = useDemoMode();

  return (
    <button
      onClick={toggleDemo}
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full shadow-lg transition-all ${
        isDemoMode
          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
          : 'bg-surface0 text-muted hover:bg-surface1'
      }`}
      title={isDemoMode ? 'Disable Demo Mode' : 'Enable Demo Mode'}
    >
      {isDemoMode ? <FiToggleRight size={20} /> : <FiToggleLeft size={20} />}
      <span className="text-sm font-semibold">{isDemoMode ? 'Demo Mode ON' : 'Demo Mode OFF'}</span>
    </button>
  );
};
