import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/shared/hooks/useTheme';

export function ToggleSwitch () {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-black dark:text-white transition-colors duration-300 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <button
          onClick={toggleTheme}
          className="mx-auto flex cursor-pointer items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
        >
          {theme === 'Dark' ? <Sun size={18} /> : <Moon size={18} />}
          <span>Switch to {theme === 'Light' ? 'Dark' : 'Light'} Mode</span>
        </button>

        <div className="rounded-xl p-6 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-semibold mb-2">Tailwind Dark Mode Demo</h1>
          <p className="text-gray-600 dark:text-gray-300">Current Theme: <strong>{theme}</strong></p>
        </div>
      </div>
    </div>
  );
};

export default ToggleSwitch;
