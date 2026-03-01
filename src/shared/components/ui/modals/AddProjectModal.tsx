import { useState, useEffect, useRef } from 'react';
import {
  FaTimes,
  FaRocket,
  FaGithub,
  FaGlobe,
  FaImage,
  FaUserPlus,
  FaSearch,
} from 'react-icons/fa';
import { container } from '@/application';
import { ProjectRepository } from '@/infrastructure/repositories/ProjectRepository';
import { Project } from '@/domain/entities/Project';
import { ContributorDetails, ProjectCreateData, ProjectStatus } from '@/types/project';
import '@/styles/modals/AddProjectModal.css';
import { UserRepository } from '@/infrastructure/repositories/UserRepository';
import { UserSearchData } from '@/types/user';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectAdded: (project: Project) => void;
}

const AddProjectModal = ({ isOpen, onClose, onProjectAdded }: AddProjectModalProps) => {
  const projectRepo = container.get('projectRepository') as ProjectRepository;
  const userRepo = container.get('userRepository') as UserRepository; // Assuming a user repository exists

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    status: ProjectStatus.DRAFT,
    github_link: '',
    live_url: '',
    image: '',
    technologies: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [contributorSearch, setContributorSearch] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchData[]>([]);
  const [selectedContributors, setSelectedContributors] = useState<ContributorDetails[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    try {
      const response: UserSearchData[] = await userRepo.searchUsers(query);
      console.log('Search results:', response);
      setSearchResults(response || []);
      setShowDropdown(true);
    } catch (err) {
      console.error('Error searching users:', err);
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  const handleContributorSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setContributorSearch(value);
    setShowDropdown(true);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchUsers(value);
    }, 300);
  };

  const addContributor = (user: ContributorDetails) => {
    if (!selectedContributors.find((c) => c.id === user.id)) {
      setSelectedContributors([...selectedContributors, user]);
    }
    setContributorSearch('');
    setSearchResults([]);
    setShowDropdown(false);
  };

  const removeContributor = (userId: number) => {
    setSelectedContributors(selectedContributors.filter((c) => c.id !== userId));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!formData.title.trim()) {
        setError('Project title is required');
        setLoading(false);
        return;
      }

      if (!formData.description.trim()) {
        setError('Project description is required');
        setLoading(false);
        return;
      }

      if (!formData.category.trim()) {
        setError('Project category is required');
        setLoading(false);
        return;
      }

      const technologies = formData.technologies
        .split(',')
        .map((tech) => tech.trim())
        .filter((tech) => tech);

      const newProject: ProjectCreateData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        status: formData.status as any,
        github_link: formData.github_link,
        live_url: formData.live_url,
        image: formData.image,
        technologies,
        contributors: selectedContributors.map((c) => c.email),
      };

      const savedProject = await projectRepo.createProject(newProject);
      setSuccess('Project created successfully!');
      onProjectAdded(savedProject);

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        status: ProjectStatus.DRAFT,
        github_link: '',
        live_url: '',
        image: '',
        technologies: '',
      });

      // Close modal after 1.5 seconds
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error('Error creating project:', err);
      setError(err.message || 'Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="add-project-modal-overlay" onClick={onClose}></div>
      <div className="add-project-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-content">
            <div className="header-icon">
              <FaRocket />
            </div>
            <div>
              <h2>Create New Project</h2>
              <p>Dont forget to add contributers</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="title">Project Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter project title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter project description"
              rows={4}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g., Web Development, Hardware"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" value={formData.status} onChange={handleChange}>
                <option value={ProjectStatus.DRAFT}>Draft</option>
                <option value={ProjectStatus.IN_PROGRESS}>In Progress</option>
                <option value={ProjectStatus.COMPLETED}>Completed</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="technologies">Technologies (comma-separated)</label>
            <input
              type="text"
              id="technologies"
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
              placeholder="e.g., React, Node.js, PostgreSQL"
            />
          </div>

          <div className="form-group">
            <label htmlFor="contributors">
              <FaUserPlus /> Contributors
            </label>
            <div className="contributor-search-wrapper" ref={dropdownRef}>
              <div className="search-input-wrapper">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  id="contributors"
                  value={contributorSearch}
                  onChange={handleContributorSearch}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Search users by name or email..."
                  autoComplete="off"
                />
              </div>
              {showDropdown && searchResults.length > 0 && (
                <div className="search-dropdown">
                  {searchResults.map((user) => (
                    <div
                      key={user.email}
                      className="search-result-item"
                      onClick={() => addContributor(user)}
                    >
                      <div className="user-info">
                        <div className="user-name">{user.name}</div>
                        <div className="user-email">{user.email}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {selectedContributors.length > 0 && (
              <div className="selected-contributors">
                {selectedContributors.map((contributor) => (
                  <div key={contributor.id} className="contributor-tag">
                    <span>{contributor.name}</span>
                    <button
                      type="button"
                      onClick={() => removeContributor(contributor.id)}
                      className="remove-contributor"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="github_link">
                <FaGithub /> GitHub Link
              </label>
              <input
                type="url"
                id="github_link"
                name="github_link"
                value={formData.github_link}
                onChange={handleChange}
                placeholder="https://github.com/..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="live_url">
                <FaGlobe /> Live URL
              </label>
              <input
                type="url"
                id="live_url"
                name="live_url"
                value={formData.live_url}
                onChange={handleChange}
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="image">
              <FaImage /> Image URL
            </label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">{success}</div>}

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddProjectModal;
