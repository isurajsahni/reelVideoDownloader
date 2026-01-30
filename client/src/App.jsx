/**
 * App root: theme provider, layout, landing page.
 */
import { useDarkMode } from './hooks/useDarkMode';
import { DarkModeToggle } from './components/DarkModeToggle';
import { Landing } from './pages/Landing';

export default function App() {
  const [dark, toggleDark] = useDarkMode();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 flex justify-end items-center p-4 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800">
        <DarkModeToggle dark={dark} onToggle={toggleDark} />
      </header>
      <Landing />
    </div>
  );
}
