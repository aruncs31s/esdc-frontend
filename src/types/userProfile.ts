// Extended User Profile Types for comprehensive user history display

import { UserData } from './user';

export interface UserProject {
  id: number;
  title: string;
  description: string;
  image?: string;
  status: 'draft' | 'in_progress' | 'completed' | 'archived';
  likes: number;
  views: number;
  tags: string[];
  technologies: string[];
  github_link?: string;
  live_url?: string;
  created_at: string;
  updated_at?: string;
  completed_at?: string;
}

export interface UserEvent {
  id: number;
  event_id: number;
  event_title: string;
  event_description?: string;
  event_date: string;
  participation_status: 'registered' | 'attended' | 'completed' | 'cancelled';
  role?: 'participant' | 'organizer' | 'speaker';
  registration_date: string;
  certificate_url?: string;
}

export interface UserProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  status: 'active' | 'inactive' | 'sold_out';
  stock?: number;
  sales_count?: number;
  created_at: string;
}

export interface UserCourse {
  id: number;
  course_id: number;
  course_title: string;
  course_description?: string;
  progress: number; // 0-100
  status: 'enrolled' | 'in_progress' | 'completed' | 'dropped';
  enrolled_date: string;
  completed_date?: string;
  certificate_url?: string;
  instructor?: string;
}

export interface UserChallenge {
  id: number;
  challenge_id: number;
  challenge_title: string;
  challenge_description?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'not_started' | 'in_progress' | 'completed' | 'abandoned';
  points_earned?: number;
  completion_date?: string;
  attempts?: number;
  best_score?: number;
}

export interface UserAchievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  category: string;
  earned_date: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserLike {
  id: number;
  project_id?: number;
  project_title?: string;
  product_id?: number;
  product_name?: string;
  liked_at: string;
}

export interface UserActivity {
  id: number;
  type:
    | 'project_created'
    | 'event_joined'
    | 'challenge_completed'
    | 'product_added'
    | 'achievement_earned'
    | 'comment_posted'
    | 'like_given';
  title: string;
  description?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface UserStats {
  total_projects: number;
  completed_projects: number;
  total_events_attended: number;
  total_products: number;
  total_courses_completed: number;
  total_challenges_completed: number;
  total_achievements: number;
  total_likes_given: number;
  total_likes_received: number;
  total_points: number;
  rank?: number;
  streak_days?: number;
}

/**
 * Complete User Profile with all history and activities
 */
export interface UserProfileComplete extends UserData {
  stats?: UserStats;
  projects?: UserProject[];
  events?: UserEvent[];
  products?: UserProduct[];
  courses?: UserCourse[];
  challenges?: UserChallenge[];
  achievements?: UserAchievement[];
  likes?: UserLike[];
  recent_activity?: UserActivity[];
}

/**
 * API Response structure for user profile
 */
export interface UserProfileResponse {
  success: boolean;
  data: UserProfileComplete;
  message?: string;
}
