import type { Report } from '../../types';

interface ReportViewerProps {
  report?: Report;
  isGenerating?: boolean;
}

const ReportViewer = ({ report, isGenerating }: ReportViewerProps) => {
  return (
    <div className="report-viewer">
      <h2>Report Preview</h2>
      {isGenerating && <p>Generating report...</p>}
      {report && (
        <div>
          <h3>{report.type.toUpperCase()} Report</h3>
          <pre>{report.content}</pre>
        </div>
      )}
    </div>
  );
};

export default ReportViewer;
