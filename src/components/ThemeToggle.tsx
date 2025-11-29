import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function ThemeToggle() {
  const [theme, setThemeState] = useState<Theme>('system');

  useEffect(() => {
    const savedTheme = localStorage.getItem('gitlog-theme') as Theme | null;
    if (savedTheme) {
      setThemeState(savedTheme);
      applyTheme(savedTheme);
    } else {
      setThemeState('system');
      applyTheme('system');
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(systemTheme);
    } else {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(newTheme);
    }
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('gitlog-theme', newTheme);
    applyTheme(newTheme);
  };

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => applyTheme('system');

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const getIcon = () => {
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      return systemTheme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />;
    }
    return theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          {getIcon()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun className="mr-2 h-4 w-4" />
          亮色模式
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon className="mr-2 h-4 w-4" />
          暗色模式
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <Monitor className="mr-2 h-4 w-4" />
          跟随系统
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
