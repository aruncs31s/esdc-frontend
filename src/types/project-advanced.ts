// Advanced Project Features Types

export interface TrendingProject {
  id: number;
  title: string;
  image: string | null;
  category: string;
  likes: number;
  views: number;
  comment_count: number;
  trending_score: number;
  creator_details: {
    id: number;
    name: string;
    email: string;
  };
}

export interface RecommendedProject {
  id: number;
  title: string;
  description: string;
  image: string | null;
  category: string;
  likes: number;
  technologies_used: Array<{ id: number; name: string }>;
  creator_details: {
    id: number;
    name: string;
    email: string;
  };
  match_score: number;
  recommend_reason: string;
}

export interface ProjectAnalytics {
  project_id: number;
  title: string;
  total_views: number;
  total_likes: number;
  total_comments: number;
  average_rating: number;
  views_trend: Array<{ date: string; count: number; change_percent: number }>;
  likes_trend: Array<{ date: string; count: number; change_percent: number }>;
  popular_technologies: Array<{ name: string; count: number }>;
  created_at: string;
  updated_at: string;
}

export interface PlatformAnalytics {
  total_projects: number;
  total_views: number;
  total_likes: number;
  popular_technologies: Array<{
    name: string;
    usage_count: number;
    project_count: number;
  }>;
  popular_tags: Array<{
    name: string;
    usage_count: number;
    project_count: number;
  }>;
  top_projects: TrendingProject[];
  category_distribution: Array<{
    category: string;
    project_count: number;
    percentage: number;
  }>;
}

export interface ProjectTemplate {
  id: number;
  name: string;
  description: string;
  image: string | null;
  category: string;
  usage_count: number;
  creator_details: {
    id: number;
    name: string;
    email: string;
  };
  created_at: string;
}

export interface ProjectNotification {
  id: number;
  type: 'like' | 'comment' | 'follow' | 'milestone';
  title: string;
  message: string;
  project_id: number | null;
  triggered_by: {
    id: number;
    name: string;
    email: string;
  } | null;
  is_read: boolean;
  created_at: string;
}

export interface ExportedProject {
  project: any;
  statistics?: {
    view_count: number;
    like_count: number;
    comment_count: number;
    review_count: number;
    average_rating: number;
  };
  comments?: any[];
  reviews?: any[];
  exported_at: string;
  export_format: 'json' | 'pdf';
}

export interface PortfolioExport {
  export_date: string;
  total_projects: number;
  projects: any[];
  statistics: {
    total_views: number;
    total_likes: number;
    total_comments: number;
    average_rating: number;
  };
}
