import { useState } from 'react';
import { TaskBoard, MilestoneTracker, TeamManagement, ProjectTimeline } from '@/features/planning';
import '../styles/project-planning.css';

// Task and Board types are defined in @/types/project-planning

export default function ProjectPlanningPage() {
  const [projectId] = useState(1); // TODO: Get from route params
  const [activeTab, setActiveTab] = useState<'tasks' | 'milestones' | 'team' | 'timeline'>('tasks');

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Project Planning</h1>
      <div className="flex gap-4 mb-6">
        {(['tasks', 'milestones', 'team', 'timeline'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-semibold ${activeTab === tab ? 'bg-primary text-white' : 'bg-surface0'}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      <div>
        {activeTab === 'tasks' && <TaskBoard projectId={projectId} />}
        {activeTab === 'milestones' && <MilestoneTracker projectId={projectId} />}
        {activeTab === 'team' && <TeamManagement projectId={projectId} />}
        {activeTab === 'timeline' && <ProjectTimeline projectId={projectId} />}
      </div>
    </div>
  );
}
