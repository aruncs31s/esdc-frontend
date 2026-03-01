import { demoService } from './DemoService';

export class DemoApiInterceptor {
  private isDemoMode = () => localStorage.getItem('esdc_demo_mode') === 'true';

  async intercept(url: string, method: string, data?: any): Promise<any> {
    if (!this.isDemoMode()) return null;

    // Projects
    if (url.includes('/projects/trending')) return demoService.getProjects();
    if (url.includes('/projects/recommendations')) return demoService.getProjects();
    if (url.match(/\/projects\/\d+\/similar/)) return demoService.getProjects();
    if (url.match(/\/projects\/\d+\/analytics/)) {
      const id = parseInt(url.match(/\/projects\/(\d+)/)?.[1] || '1');
      return demoService.getAnalytics(id);
    }
    if (url.match(/\/projects\/\d+\/export/)) {
      const id = parseInt(url.match(/\/projects\/(\d+)/)?.[1] || '1');
      return demoService.exportProject(id, 'json', true);
    }
    if (url.match(/\/projects\/\d+$/)) {
      const id = parseInt(url.match(/\/projects\/(\d+)/)?.[1] || '1');
      return demoService.getProject(id);
    }

    // Tasks
    if (url.includes('/tasks') && method === 'GET') {
      const projectId = parseInt(url.match(/\/projects\/(\d+)/)?.[1] || '1');
      return demoService.getTasks(projectId);
    }
    if (url.includes('/tasks') && method === 'POST') {
      const projectId = parseInt(url.match(/\/projects\/(\d+)/)?.[1] || '1');
      return demoService.createTask(projectId, data);
    }
    if (url.match(/\/tasks\/\d+/) && method === 'PUT') {
      const projectId = parseInt(url.match(/\/projects\/(\d+)/)?.[1] || '1');
      const taskId = parseInt(url.match(/\/tasks\/(\d+)/)?.[1] || '1');
      return demoService.updateTask(projectId, taskId, data);
    }
    if (url.match(/\/tasks\/\d+/) && method === 'DELETE') {
      return demoService.deleteTask();
    }

    // Milestones
    if (url.includes('/milestones') && method === 'GET') {
      const projectId = parseInt(url.match(/\/projects\/(\d+)/)?.[1] || '1');
      return demoService.getMilestones(projectId);
    }
    if (url.includes('/milestones') && method === 'POST') {
      const projectId = parseInt(url.match(/\/projects\/(\d+)/)?.[1] || '1');
      return demoService.createMilestone(projectId, data);
    }

    // Timeline
    if (url.includes('/timeline')) {
      const projectId = parseInt(url.match(/\/projects\/(\d+)/)?.[1] || '1');
      return demoService.getTimeline(projectId);
    }

    // Team
    if (url.includes('/team')) {
      const projectId = parseInt(url.match(/\/projects\/(\d+)/)?.[1] || '1');
      return demoService.getTeamMembers(projectId);
    }

    // Notifications
    if (url.includes('/notifications') && method === 'GET') {
      return demoService.getNotifications();
    }
    if (url.includes('/notifications') && method === 'POST') {
      return demoService.markNotificationRead(1);
    }

    // Templates
    if (url.includes('/templates')) {
      return demoService.getTemplates();
    }

    return null;
  }
}

export const demoApiInterceptor = new DemoApiInterceptor();
