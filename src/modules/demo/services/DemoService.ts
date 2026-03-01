import {
  demoUsers,
  demoProjects,
  demoTasks,
  demoMilestones,
  demoNotifications,
  demoTemplates,
  demoTeamMembers,
} from '../data/mockData';

class DemoService {
  private delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  async getUsers() {
    await this.delay(300);
    return demoUsers.map((u) => ({ ...u, user_details: u }));
  }

  async getProjects() {
    await this.delay(300);
    return demoProjects.map((p) => ({
      ...p,
      creator_details: demoUsers.find((u) => u.id === p.creator_id),
      trending_score: p.likes * 0.4 + p.views * 0.3 + p.comment_count * 0.2,
    }));
  }

  async getProject(id: number) {
    await this.delay(300);
    const project = demoProjects.find((p) => p.id === id);
    if (!project) throw new Error('Project not found');
    return {
      ...project,
      creator_details: demoUsers.find((u) => u.id === project.creator_id),
    };
  }

  async getTasks(projectId: number) {
    await this.delay(300);
    return demoTasks
      .filter((t) => t.project_id === projectId)
      .map((t) => ({
        ...t,
        assigned_user: demoUsers.find((u) => u.id === t.assigned_to),
      }));
  }

  async createTask(projectId: number, task: any) {
    await this.delay(300);
    return { id: Date.now(), project_id: projectId, ...task, created_at: new Date().toISOString() };
  }

  async updateTask(_projectId: number, taskId: number, updates: any) {
    await this.delay(300);
    const task = demoTasks.find((t) => t.id === taskId);
    return { ...task, ...updates };
  }

  async deleteTask() {
    await this.delay(300);
    return true;
  }

  async getMilestones(projectId: number) {
    await this.delay(300);
    return demoMilestones.filter((m) => m.project_id === projectId);
  }

  async createMilestone(projectId: number, milestone: any) {
    await this.delay(300);
    return {
      id: Date.now(),
      project_id: projectId,
      ...milestone,
      created_at: new Date().toISOString(),
    };
  }

  async getNotifications() {
    await this.delay(300);
    return demoNotifications.map((n) => ({
      ...n,
      triggered_by: demoUsers[Math.floor(Math.random() * demoUsers.length)],
    }));
  }

  async markNotificationRead(_id: number) {
    await this.delay(200);
    return true;
  }

  async getTemplates() {
    await this.delay(300);
    return demoTemplates.map((t) => ({
      ...t,
      creator_details: demoUsers.find((u) => u.id === t.creator_id),
      created_at: new Date().toISOString(),
    }));
  }

  async getTeamMembers(projectId: number) {
    await this.delay(300);
    return demoTeamMembers
      .filter((m) => m.project_id === projectId)
      .map((m) => ({
        ...m,
        user_details: demoUsers.find((u) => u.id === m.user_id),
      }));
  }

  async getTimeline(projectId: number) {
    await this.delay(300);
    return {
      project_id: projectId,
      start_date: '2025-11-01',
      end_date: '2026-01-31',
      total_duration_days: 91,
      progress_percentage: 55,
      milestones: demoMilestones.filter((m) => m.project_id === projectId),
      tasks: demoTasks.filter((t) => t.project_id === projectId),
    };
  }

  async getAnalytics(projectId: number) {
    await this.delay(300);
    const project = demoProjects.find((p) => p.id === projectId);
    return {
      project_id: projectId,
      title: project?.title,
      total_views: project?.views || 0,
      total_likes: project?.likes || 0,
      total_comments: project?.comment_count || 0,
      average_rating: 4.5,
      views_trend: [
        { date: '2025-11-25', count: 120, change_percent: 5.2 },
        { date: '2025-11-26', count: 135, change_percent: 12.5 },
        { date: '2025-11-27', count: 142, change_percent: 5.2 },
      ],
      likes_trend: [],
      popular_technologies: [
        { name: 'Arduino', count: 45 },
        { name: 'C++', count: 38 },
      ],
      created_at: '2025-11-01',
      updated_at: new Date().toISOString(),
    };
  }

  async exportProject(id: number, format: string, includeStats: boolean) {
    await this.delay(500);
    const project = await this.getProject(id);
    return {
      project,
      statistics: includeStats
        ? { view_count: 2340, like_count: 156, comment_count: 23 }
        : undefined,
      exported_at: new Date().toISOString(),
      export_format: format,
    };
  }
}

export const demoService = new DemoService();
