export interface ProjectDTO {
  id?: string | null;
  title?: string;
  description?: string;
  status?: string;
  category?: string;
  tags?: string[];
  githubUrl?: string;
  github_link?: string;
  liveUrl?: string;
  live_url?: string;
  image?: string;
  image_url?: string;
  technologies?: string[];
  features?: string[];
  userId?: string | null;
  user_id?: string | null;
  likes?: number;
  views?: number;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
  completedAt?: string | null;
  completed_at?: string | null;
  contributors?: string[];
  cost?: number;
}