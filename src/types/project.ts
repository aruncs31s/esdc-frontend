// Projcect related types and interfaces
// Used across the application for type safety
// Created_By: Arun CS
// Created_Date: Sat Oct 11 10:32:29 PM IST 2025

export interface ProjectDataForAdmin {
  id: number;
  title: string;
  created_by: string;
  status: string;
  created_at: string;
}

export const ProjectStatus = {
  DRAFT: 'draft',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
} as const;

export type ProjectStatusType = (typeof ProjectStatus)[keyof typeof ProjectStatus];

export interface ContributorDetails {
  id: number;
  name: string;
  email: string;
}
export interface TagDetails {
  id: number;
  name: string;
}
export interface TechnologyDetails {
  id: number;
  name: string;
}
// This one

// This is used both admin and the user project views.
export interface ProjectData {
  id?: string;
  title?: string;
  description?: string;
  status?: ProjectStatusType;
  category?: string;
  tags?: TagDetails[];
  github_link?: string;
  live_url?: string;
  image?: string;
  technologies?: TechnologyDetails[];
  user_id?: string | null;
  likes?: number;
  views?: number;
  created_at?: string;
  updated_at?: string;
  completed_at?: string | null;
  contributors?: ContributorDetails[];
  cost?: number;
}
export interface ProjectCreateData {
  title: string;
  description: string;
  status: ProjectStatusType;
  category: string;
  github_link?: string;
  live_url?: string;
  image?: string;
  technologies?: string[];
  contributors?: string[];
}
