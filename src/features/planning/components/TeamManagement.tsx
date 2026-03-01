import { useState, useEffect } from 'react';
import { FiUsers, FiPlus, FiTrash2 } from 'react-icons/fi';
import { projectPlanningApi } from '@/infrastructure/api/projectPlanningApi';
import type { TeamMember } from '@/types/project-planning';

interface Props {
  projectId: number;
}

export const TeamManagement = ({ projectId }: Props) => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectPlanningApi
      .getTeamMembers(projectId)
      .then(setMembers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [projectId]);

  const handleRemove = async (memberId: number) => {
    if (!confirm('Remove this member?')) return;
    try {
      await projectPlanningApi.removeTeamMember(projectId, memberId);
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="text-center py-8">Loading team...</div>;

  return (
    <div className="team-management">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FiUsers /> Team Members
        </h2>
        <button className="btn btn-primary btn-sm flex items-center gap-2">
          <FiPlus /> Add Member
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => (
          <div key={member.id} className="glass-card p-4">
            <div className="flex items-start gap-3">
              <img
                src={
                  member.user_details.avatar ||
                  `https://ui-avatars.com/api/?name=${member.user_details.name}`
                }
                alt={member.user_details.name}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{member.user_details.name}</h3>
                <p className="text-sm text-muted">{member.role}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {member.permissions.map((perm) => (
                    <span key={perm} className="text-xs px-2 py-1 bg-surface0 rounded">
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => handleRemove(member.id)}
                className="text-danger hover:text-danger-dark"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
