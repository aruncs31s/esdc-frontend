/**
 * User Model
 * Represents a user entity in the ESDC system
 */

import { UserData, ValidationResult } from "./user";

export const PROJECT_TYPES = {
    EMBEDDED: 'embedded',
    WEBAPP: 'webapp',
    AI_ML: 'ai_ml'
} as const;

export const PROJECT_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    SUSPENDED: 'suspended',
    PENDING: 'pending',
    FINISHED: 'finished'
} as const;

export type PROJECT_TYPES = typeof PROJECT_TYPES[keyof typeof PROJECT_TYPES];
export type PROJECT_STATUS = typeof PROJECT_STATUS[keyof typeof PROJECT_STATUS];



export interface ProjectData {
    id?: string | null;
    title?: string;
    image?: string;
    category?: PROJECT_TYPES;
    status?: PROJECT_STATUS;
    github_link?: string;
    live_url?: string;
    created_by?: string;
    modified_by?: string;
    created_at?: string;
    updated_at?: string;
    likes?: number;
    cost?: number;
    description?: string;
    tags?: string[];
    contributors?: string[];
}



/**
 * User class representing a project entity
 */
export class Project {
    id?: string | null;
    title?: string;
    image?: string;
    category?: PROJECT_TYPES;
    status?: PROJECT_STATUS;
    github_link?: string;
    live_url?: string;
    created_by?: string;
    modified_by?: string;
    created_at?: string;
    updated_at?: string;
    likes?: number;
    cost?: number;
    description?: string;
    tags?: string[];
    contributors?: string[];

    constructor(data: ProjectData = {}) {
        this.id = data.id || null;
        this.title = data.title || '';
        this.image = data.image || '';
        this.category = data.category || PROJECT_TYPES.WEBAPP;
        this.status = data.status || PROJECT_STATUS.ACTIVE;
        this.github_link = data.github_link || '';
        this.live_url = data.live_url || '';
        this.created_by = data.created_by || '';
        this.modified_by = data.modified_by || '';
        this.created_at = data.created_at || new Date().toISOString();
        this.updated_at = data.updated_at || new Date().toISOString();
        this.likes = data.likes || 0;
        this.cost = data.cost || 0;
        this.description = data.description || '';
        this.tags = data.tags || [];
        this.contributors = data.contributors || [];
        this.status = data.status || PROJECT_STATUS.ACTIVE;
        this.github_link = data.github_link || '';
        this.live_url = data.live_url || '';
        this.created_by = data.created_by || '';
        this.modified_by = data.modified_by || '';
        this.created_at = data.created_at || new Date().toISOString();
        this.updated_at = data.updated_at || new Date().toISOString();
        this.likes = data.likes || 0;
        this.cost = data.cost || 0;
        this.description = data.description || '';
        this.tags = data.tags || [];
        this.contributors = data.contributors || [];
    }

    /**
     * Check if user is an admin
     */
    isActive(): boolean {
        return this.status === PROJECT_STATUS.ACTIVE;
    }

    /**
     * Check if user is active
     */
    isFinished(): boolean {
        return this.status === PROJECT_STATUS.FINISHED;
    }

    /**
     * Check if user is suspended
     */
    isSuspended(): boolean {
        return this.status === PROJECT_STATUS.SUSPENDED;
    }

    /**
     * Get user's full display name
     */
    getDisplayName(): string {
        return this.title || 'Untitled Project';
    }

   

    /**
     * Get user's image URL or default
     */
    getImageUrl(): string {
        return this.image || '/public/imgs/main_project_image.png';
    }



    /**
     * Convert user object to plain JSON for API calls
     */
    toJSON(): Record<string, any> {
        return {
            id: this.id,
            title: this.title,
            image: this.image,
            category: this.category,
            status: this.status,
            github_link: this.github_link,
            live_url: this.live_url,
            created_by: this.created_by,
            modified_by: this.modified_by,
            created_at: this.created_at,
            updated_at: this.updated_at,
            likes: this.likes,
            cost: this.cost,
            description: this.description,
            tags: this.tags,
            contributors: this.contributors
        };
    }

    /**
     * Create User instance from API response
     */
    static fromAPI(data: ProjectData): Project {
        return new Project(data);
    }

    /**
     * Create multiple User instances from API response array
     */
    static fromAPIArray(dataArray: ProjectData[]): Project[] {
        if (!Array.isArray(dataArray)) {
            return [];
        }
        return dataArray.map(data => Project.fromAPI(data));
    }

    /**
     * Validate user data
     */
    validate(): ValidationResult {
        const errors: string[] = [];

        if (!this.title || this.title.length < 3) {
            errors.push('Title must be at least 3 characters long');
        }

        if (!this.cost || this.cost <= 0) {
            errors.push('Valid cost is required');
        }

        if (!Object.values(PROJECT_STATUS).includes(this.status)) {
            errors.push('Invalid project status');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

   
    /**
     * Update user properties
     */
    update(updates: Partial<ProjectData>): void {
        Object.keys(updates).forEach(key => {
            if (Object.prototype.hasOwnProperty.call(this, key)) {
                (this as any)[key] = (updates as any)[key];
            }
        });
        this.updated_at = new Date().toISOString();
    }
}

/**
 * Helper function to create a new project
 */
export const createProject = (projectData: ProjectData): Project => {
    return new Project(projectData);
};


export default Project;
