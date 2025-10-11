export interface ProjectResponseDTO {
  id: string ;
  title: string;
  description?: string;
  image?: string;
  status: string;
  category: string;
  tags?: string[];
  github_link?: string;
  live_url?: string;
  user_id?: string | null;
  likes?: number;
  views?: number;
  created_at?: string;
  updated_at?: string;
  completed_at?: string | null;
  contributors?: ContributorDetails[];
  tagsDetails?: TagDetails[];
  technologyDetails?: TechnologyDetails[];
  created_by?: string;
  modified_by?: string;
  cost?: number;
}

interface ContributorDetails {
  id: number;
  name: string;
  email: string;
}
interface TagDetails {
  id: number;
  name: string;
}
interface TechnologyDetails {
  id: number;
  name: string;
}