import { useState } from 'react';
import { FileText, Edit, Trash2 } from 'lucide-react';
import { useReportStore } from '../../store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const ReportHistory = () => {
  const { reportHistory, currentReportId, removeReportFromHistory, switchToReport } = useReportStore();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleReportClick = (reportId: string) => {
    switchToReport(reportId);
  };

  const handleDeleteClick = (e: React.MouseEvent, reportId: string) => {
    e.stopPropagation();
    removeReportFromHistory(reportId);
  };

  const handleEditClick = (e: React.MouseEvent, reportId: string) => {
    e.stopPropagation();
    // TODO: Open edit dialog
    console.log('Edit report:', reportId);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (reportHistory.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-muted-foreground">No reports yet</p>
        <p className="mt-1 text-xs text-muted-foreground">Generate a report to get started</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-1 p-2">
        {reportHistory.map((report) => {
          const isActive = report.id === currentReportId;
          const isHovered = report.id === hoveredId;

          return (
            <div
              key={report.id}
              className={cn(
                'group relative flex items-start gap-3 rounded-md px-3 py-2 transition-colors cursor-pointer',
                isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'
              )}
              onClick={() => handleReportClick(report.id)}
              onMouseEnter={() => setHoveredId(report.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Icon */}
              <FileText className={cn('h-4 w-4 shrink-0 mt-0.5', isActive && 'text-primary')} />

              {/* Report Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium">{report.name}</p>
                  <Badge variant={isActive ? 'default' : 'secondary'} className="shrink-0 text-xs">
                    {report.type.toUpperCase()}
                  </Badge>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">{formatDate(report.generatedAt)}</p>
                  <span className="text-xs text-muted-foreground">•</span>
                  <p className="text-xs text-muted-foreground">{report.commits.length} commits</p>
                </div>
              </div>

              {/* Action Buttons */}
              {isHovered && (
                <div className="flex shrink-0 gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => handleEditClick(e, report.id)}
                    aria-label="Edit report"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => handleDeleteClick(e, report.id)}
                    aria-label="Delete report"
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default ReportHistory;
