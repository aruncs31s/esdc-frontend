import { useState } from 'react';
import { FiShoppingCart, FiHeart, FiSearch } from 'react-icons/fi';
import { useShop } from '../contexts/ShopContext';
import { mockProducts } from '../data/mockProducts';

const Shop = () => {
  const { addToCart, addToWishlist, wishlist } = useShop();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(mockProducts.map(p => p.category)))];

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const isInWishlist = (productId: number) => wishlist.some(item => item.id === productId);

  return (
    <section className="products-section" style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '60px' }}>
      <div className="container">
        <div className="section-header">
          <h2>Shop Products</h2>
          <p>Quality electronics and components for your embedded systems projects</p>
        </div>

        <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1', minWidth: '250px', position: 'relative' }}>
            <FiSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--subtext0)' }} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.5rem',
                borderRadius: '8px',
                border: '1px solid var(--surface0)',
                background: 'var(--surface0)',
                color: 'var(--text)'
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  border: 'none',
                  background: selectedCategory === cat ? 'var(--blue)' : 'var(--surface0)',
                  color: selectedCategory === cat ? 'var(--base)' : 'var(--text)',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="projects-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="project-card">
              <div className="project-image" style={{ position: 'relative' }}>
                <img 
                  src={product.image} 
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <button
                  onClick={() => addToWishlist(product)}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(0,0,0,0.6)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <FiHeart 
                    size={20} 
                    color={isInWishlist(product.id) ? '#f38ba8' : '#fff'}
                    fill={isInWishlist(product.id) ? '#f38ba8' : 'none'}
                  />
                </button>
              </div>
              <div className="project-content">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="project-tags" style={{ marginBottom: '1rem' }}>
                  <span className="tag">{product.category}</span>
                  <span className="tag">Stock: {product.stock}</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginTop: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--surface0)'
                }}>
                  <div style={{ 
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: 'var(--blue)'
                  }}>
                    ${product.price}
                  </div>
                  <button 
                    onClick={() => addToCart(product)}
                    className="btn btn-primary"
                    style={{ 
                      padding: '10px 20px',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <FiShoppingCart /> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Shop;
