import { useEffect, useState } from 'react';
import { FiFileText, FiPlus } from 'react-icons/fi';
import { projectAdvancedApi } from '@/infrastructure/api/projectAdvancedApi';
import type { ProjectTemplate } from '@/types/project-advanced';

export const ProjectTemplates = () => {
  const [templates, setTemplates] = useState<ProjectTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectAdvancedApi
      .getPublicTemplates()
      .then(setTemplates)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleUseTemplate = async (templateId: number) => {
    const title = prompt('Enter project title:');
    if (!title) return;

    try {
      await projectAdvancedApi.createFromTemplate({
        template_id: templateId,
        title,
        description: '',
      });
      alert('Project created from template!');
    } catch (error) {
      console.error(error);
      alert('Failed to create project');
    }
  };

  if (loading) return <div className="text-center py-8">Loading templates...</div>;

  return (
    <div className="project-templates">
      <h2 className="text-2xl font-bold mb-6">Project Templates</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="glass-card p-4">
            <div className="flex items-start gap-3 mb-3">
              <FiFileText className="text-2xl text-primary" />
              <div className="flex-1">
                <h3 className="font-semibold">{template.name}</h3>
                <p className="text-sm text-muted">{template.description}</p>
              </div>
            </div>
            <div className="text-xs text-muted mb-3">Used {template.usage_count} times</div>
            <button
              onClick={() => handleUseTemplate(template.id)}
              className="btn btn-primary btn-sm w-full flex items-center justify-center gap-2"
            >
              <FiPlus /> Use Template
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
