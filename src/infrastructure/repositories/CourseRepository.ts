import { ICourseRepository } from '@/domain/repositories/ICourseRepository';
import { Course } from '@/domain/entities/Course';
import { lmsAPI } from '@/infrastructure/api/lmsApi';

/**
 * Course Repository Implementation
 * Implements ICourseRepository using the LMS API
 */
export class CourseRepository implements ICourseRepository {
  async findAll(filters?: {
    category?: string;
    level?: string;
    status?: string;
    search?: string;
    isFree?: boolean;
  }): Promise<Course[]> {
    return await lmsAPI.getCourses(filters);
  }

  async findById(id: string | number): Promise<Course | null> {
    return await lmsAPI.getCourseById(id);
  }

  async findByCategory(category: string): Promise<Course[]> {
    return await lmsAPI.getCourses({ category });
  }

  async findByInstructor(instructorId: string): Promise<Course[]> {
    // For now, filter from all courses
    const allCourses = await this.findAll();
    return allCourses.filter((course) => course.instructorId === instructorId);
  }

  async findPopular(limit?: number): Promise<Course[]> {
    return await lmsAPI.getPopularCourses(limit);
  }

  async findFeatured(): Promise<Course[]> {
    // For now, return popular courses as featured
    return await lmsAPI.getPopularCourses(6);
  }

  async findByLevel(level: string): Promise<Course[]> {
    return await lmsAPI.getCourses({ level });
  }

  async save(course: Course): Promise<Course> {
    if (course.id) {
      return await lmsAPI.updateCourse(course.id, course.toJSON() as Record<string, unknown>);
    }
    return await lmsAPI.createCourse(course.toJSON() as Record<string, unknown>);
  }

  async delete(id: string | number): Promise<boolean> {
    return await lmsAPI.deleteCourse(id);
  }

  async count(filters?: Record<string, unknown>): Promise<number> {
    const courses = await this.findAll(filters as Parameters<typeof this.findAll>[0]);
    return courses.length;
  }

  async getCategories(): Promise<string[]> {
    return await lmsAPI.getCategories();
  }

  async search(query: string): Promise<Course[]> {
    return await lmsAPI.searchCourses(query);
  }
}

// Singleton instance
const courseRepository = new CourseRepository();
export default courseRepository;
