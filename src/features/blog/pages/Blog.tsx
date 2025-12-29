import { useState, useEffect } from 'react';
import { FiCalendar, FiUser, FiTag, FiClock, FiSearch } from 'react-icons/fi';
import '../styles/blog.css';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  coverImage?: string;
  tags: string[];
  category: string;
  publishedAt: string;
  readTime: number;
  views: number;
  likes: number;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/blog/posts');
      // const data = await response.json();
      // setPosts(data);

      // Mock data for now
      setPosts([
        {
          id: '1',
          title: 'Getting Started with Arduino',
          slug: 'getting-started-arduino',
          excerpt: 'Learn the basics of Arduino programming and hardware interfacing.',
          content: 'Full content here...',
          author: { id: '1', name: 'John Doe' },
          coverImage: 'https://via.placeholder.com/800x400',
          tags: ['Arduino', 'Beginner', 'Tutorial'],
          category: 'Tutorial',
          publishedAt: '2025-01-15',
          readTime: 5,
          views: 120,
          likes: 15,
        },
      ]);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="blog-page">
        <div className="container">
          <div className="loading-state">Loading posts...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-page">
      <div className="container">
        <div className="blog-header">
          <h1>Blog</h1>
          <p>Insights, tutorials, and updates from the ESDC community</p>
        </div>

        <div className="blog-filters">
          <div className="search-box">
            <FiSearch />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="category-filters">
            {['all', 'Tutorial', 'News', 'Project', 'Event'].map((cat) => (
              <button
                key={cat}
                className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="blog-grid">
          {filteredPosts.map((post) => (
            <article key={post.id} className="blog-card">
              {post.coverImage && (
                <div className="blog-card-image">
                  <img src={post.coverImage} alt={post.title} />
                  <span className="blog-category">{post.category}</span>
                </div>
              )}

              <div className="blog-card-content">
                <h2>{post.title}</h2>
                <p className="blog-excerpt">{post.excerpt}</p>

                <div className="blog-meta">
                  <div className="meta-item">
                    <FiUser size={14} />
                    <span>{post.author.name}</span>
                  </div>
                  <div className="meta-item">
                    <FiCalendar size={14} />
                    <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="meta-item">
                    <FiClock size={14} />
                    <span>{post.readTime} min read</span>
                  </div>
                </div>

                <div className="blog-tags">
                  {post.tags.map((tag) => (
                    <span key={tag} className="tag">
                      <FiTag size={12} />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="empty-state">
            <p>No posts found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
