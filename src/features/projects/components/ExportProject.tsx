import { useState } from 'react';
import { FiDownload } from 'react-icons/fi';
import { projectAdvancedApi } from '@/infrastructure/api/projectAdvancedApi';

interface Props {
  projectId?: number;
  isPortfolio?: boolean;
}

export const ExportProject = ({ projectId, isPortfolio = false }: Props) => {
  const [loading, setLoading] = useState(false);
  const [format, setFormat] = useState<'json' | 'pdf'>('json');
  const [includeStats, setIncludeStats] = useState(true);

  const handleExport = async () => {
    setLoading(true);
    try {
      const data = isPortfolio
        ? await projectAdvancedApi.exportPortfolio(format, includeStats)
        : await projectAdvancedApi.exportProject(projectId!, format, includeStats);

      if (format === 'json') {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${isPortfolio ? 'portfolio' : `project-${projectId}`}.json`;
        a.click();
      } else {
        const blob = data as Blob;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${isPortfolio ? 'portfolio' : `project-${projectId}`}.pdf`;
        a.click();
      }
    } catch (error) {
      console.error(error);
      alert('Export failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="export-project glass-card p-4">
      <h3 className="font-semibold mb-4">Export {isPortfolio ? 'Portfolio' : 'Project'}</h3>
      <div className="space-y-3">
        <div>
          <label className="block text-sm mb-2">Format</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as 'json' | 'pdf')}
            className="w-full p-2 rounded border"
          >
            <option value="json">JSON</option>
            <option value="pdf">PDF</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={includeStats}
            onChange={(e) => setIncludeStats(e.target.checked)}
            id="includeStats"
          />
          <label htmlFor="includeStats" className="text-sm">
            Include Statistics
          </label>
        </div>
        <button
          onClick={handleExport}
          disabled={loading}
          className="btn btn-primary w-full flex items-center justify-center gap-2"
        >
          <FiDownload /> {loading ? 'Exporting...' : 'Export'}
        </button>
      </div>
    </div>
  );
};
