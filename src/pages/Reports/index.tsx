import { useReportStore } from '@/store/reportStore';
import ReportViewer from '@/components/ReportViewer';
import { EmptyState } from '@/components/EmptyState';

export function Reports() {
  const { currentReportId } = useReportStore();

  return (
    <div className="p-6 h-full flex gap-6">
      <div className="flex-1">
        {currentReportId ? (
          <ReportViewer />
        ) : (
          <EmptyState
            title="Select a Report"
            description="Choose a report from the list to view details"
          />
        )}
      </div>
    </div>
  );
}
