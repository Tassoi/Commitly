import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useUIStore } from '../../store';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import RepoHistory from './RepoHistory';
import ReportHistory from './ReportHistory';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  return (
    <aside
      className={cn(
        'relative h-full border-r bg-background transition-all duration-300',
        sidebarCollapsed ? 'w-0' : 'w-[280px]'
      )}
    >
      {/* Collapse/Expand Button */}
      <Button
        variant="outline"
        size="icon"
        className="absolute -right-3 top-4 z-50 h-6 w-6 rounded-full"
        onClick={toggleSidebar}
        aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>

      {/* Sidebar Content */}
      <div
        className={cn(
          'flex h-full flex-col overflow-hidden transition-opacity duration-300',
          sidebarCollapsed ? 'opacity-0' : 'opacity-100'
        )}
      >
        {/* Repository History Section */}
        <div className="flex-shrink-0 p-4">
          <h2 className="mb-3 text-sm font-semibold">Repositories</h2>
          <RepoHistory />
        </div>

        <Separator />

        {/* Report History Section */}
        <div className="flex-shrink-0 p-4">
          <h2 className="mb-3 text-sm font-semibold">Reports</h2>
          <ReportHistory />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
