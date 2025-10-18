import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiUser, FiPackage, FiFileText, FiFolder, FiX } from 'react-icons/fi';
import '../styles/search.css';

interface user {
  id: number;
  name: string;
  username: string;
  avatar: string;
  role: string;
  website?: string;
}

interface product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

interface blog {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
}

interface project {
  id: number;
  title: string;
  description: string;
  author: string;
  stars: number;
}

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [results, setResults] = useState<{
    users: user[];
    products: product[];
    blogs: blog[];
    projects: project[];
  }>({
    users: [],
    products: [],
    blogs: [],
    projects: [],
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const categories = [
    { id: 'all', label: 'All', icon: FiSearch },
    { id: 'users', label: 'Users', icon: FiUser },
    { id: 'products', label: 'Products', icon: FiPackage },
    { id: 'blogs', label: 'Blogs', icon: FiFileText },
    { id: 'projects', label: 'Projects', icon: FiFolder },
  ];

  useEffect(() => {
    const q = searchParams.get('q');
    const cat = searchParams.get('category');
    if (q) {
      setQuery(q);
      setCategory(cat || 'all');
      setActiveTab(cat || 'all');
      performSearch(q, cat || 'all');
    }
  }, [searchParams]);

  const performSearch = async (searchQuery: string, searchCategory: string) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      // Mock search results - replace with actual API calls
      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockResults = {
        users:
          searchCategory === 'all' || searchCategory === 'users'
            ? [
                {
                  id: 1,
                  name: 'John Doe',
                  username: '@johndoe',
                  avatar: 'https://via.placeholder.com/50',
                  role: 'Developer',
                },
                {
                  id: 2,
                  name: 'Jane Smith',
                  username: '@janesmith',
                  avatar: 'https://via.placeholder.com/50',
                  role: 'Designer',
                },
              ]
            : [],
        products:
          searchCategory === 'all' || searchCategory === 'products'
            ? [
                {
                  id: 1,
                  name: 'Arduino Starter Kit',
                  price: 45.99,
                  image: 'https://via.placeholder.com/100',
                  category: 'Hardware',
                  stock: 25,
                },
                {
                  id: 2,
                  name: 'Raspberry Pi 4',
                  price: 75.0,
                  image: 'https://via.placeholder.com/100',
                  category: 'Hardware',
                  stock: 15,
                },
              ]
            : [],
        blogs:
          searchCategory === 'all' || searchCategory === 'blogs'
            ? [
                {
                  id: 1,
                  title: 'Getting Started with IoT',
                  excerpt: 'Learn the basics of Internet of Things...',
                  author: 'John Doe',
                  date: '2025-01-15',
                },
                {
                  id: 2,
                  title: 'Building Your First Robot',
                  excerpt: 'A comprehensive guide to robotics...',
                  author: 'Jane Smith',
                  date: '2025-01-10',
                },
              ]
            : [],
        projects:
          searchCategory === 'all' || searchCategory === 'projects'
            ? [
                {
                  id: 1,
                  title: 'Smart Home Automation',
                  description: 'IoT-based home automation system',
                  author: 'John Doe',
                  stars: 45,
                },
                {
                  id: 2,
                  title: 'Line Following Robot',
                  description: 'Autonomous robot using sensors',
                  author: 'Jane Smith',
                  stars: 32,
                },
              ]
            : [],
      };

      setResults(mockResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query, category });
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults({ users: [], products: [], blogs: [], projects: [] });
    setSearchParams({});
  };

  const getTotalResults = () => {
    return Object.values(results).reduce((sum, arr) => sum + arr.length, 0);
  };

  // const getFilteredResults = () => {
  //   if (activeTab === 'all') return results;
  //   return { [activeTab]: results[activeTab] };
  // };

  return (
    <div className="search-page">
      <div className="search-header">
        <div className="container">
          <h1>Search</h1>
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-wrapper">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search for users, products, blogs, projects..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search-input"
              />
              {query && (
                <button type="button" onClick={clearSearch} className="clear-btn">
                  <FiX />
                </button>
              )}
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="category-select"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
            <button type="submit" className="search-btn">
              Search
            </button>
          </form>
        </div>
      </div>

      {query && (
        <div className="search-results">
          <div className="container">
            <div className="results-header">
              <h2>
                {getTotalResults()} results for "{query}"
              </h2>
              <div className="category-tabs">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const count =
                    cat.id === 'all'
                      ? getTotalResults()
                      : results[cat.id as keyof typeof results]?.length || 0;
                  return (
                    <button
                      key={cat.id}
                      className={`tab ${activeTab === cat.id ? 'active' : ''}`}
                      onClick={() => setActiveTab(cat.id)}
                    >
                      <Icon /> {cat.label} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {loading ? (
              <div className="loading">Searching...</div>
            ) : (
              <div className="results-content">
                {(activeTab === 'all' || activeTab === 'users') && results.users.length > 0 && (
                  <section className="result-section">
                    <h3>
                      <FiUser /> Users
                    </h3>
                    <div className="user-results">
                      {results.users.map((user) => (
                        <div key={user.id} className="user-card">
                          <img src={user.avatar} alt={user.name} />
                          <div className="user-info">
                            <h4>{user.name}</h4>
                            <p className="username">{user.username}</p>
                            <span className="role">{user.role}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {(activeTab === 'all' || activeTab === 'products') &&
                  results.products.length > 0 && (
                    <section className="result-section">
                      <h3>
                        <FiPackage /> Products
                      </h3>
                      <div className="product-results">
                        {results.products.map((product) => (
                          <div key={product.id} className="product-card">
                            <img src={product.image} alt={product.name} />
                            <div className="product-info">
                              <h4>{product.name}</h4>
                              <p className="category">{product.category}</p>
                              <div className="product-footer">
                                <span className="price">${product.price}</span>
                                <span className="stock">{product.stock} in stock</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                {(activeTab === 'all' || activeTab === 'blogs') && results.blogs.length > 0 && (
                  <section className="result-section">
                    <h3>
                      <FiFileText /> Blogs
                    </h3>
                    <div className="blog-results">
                      {results.blogs.map((blog) => (
                        <div key={blog.id} className="blog-card">
                          <h4>{blog.title}</h4>
                          <p className="excerpt">{blog.excerpt}</p>
                          <div className="blog-meta">
                            <span>By {blog.author}</span>
                            <span>{blog.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {(activeTab === 'all' || activeTab === 'projects') &&
                  results.projects.length > 0 && (
                    <section className="result-section">
                      <h3>
                        <FiFolder /> Projects
                      </h3>
                      <div className="project-results">
                        {results.projects.map((project) => (
                          <div key={project.id} className="project-card">
                            <h4>{project.title}</h4>
                            <p>{project.description}</p>
                            <div className="project-footer">
                              <span>By {project.author}</span>
                              <span>⭐ {project.stars}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                {getTotalResults() === 0 && !loading && (
                  <div className="no-results">
                    <FiSearch size={48} />
                    <h3>No results found</h3>
                    <p>Try different keywords or categories</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
