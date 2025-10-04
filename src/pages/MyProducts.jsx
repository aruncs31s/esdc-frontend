import { useState } from 'react';
import { FiShoppingBag, FiDollarSign, FiEdit, FiTrash2 } from 'react-icons/fi';

const MyProducts = () => {
  const [myProducts] = useState([
    {
      id: 1,
      name: 'Custom PCB Design',
      price: 25.00,
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop',
      description: 'Custom designed PCB for Arduino projects',
      category: 'Hardware',
      sales: 12
    },
    {
      id: 2,
      name: 'Sensor Module Kit',
      price: 35.00,
      image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop',
      description: 'Curated sensor kit for IoT projects',
      category: 'Components',
      sales: 8
    }
  ]);

  return (
    <section className="products-section" style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '60px' }}>
      <div className="container">
        <div className="section-header">
          <h2>My Products</h2>
          <p>Manage your products and track sales</p>
        </div>

        <div className="projects-grid">
          {myProducts.map((product) => (
            <div key={product.id} className="project-card">
              <div className="project-image">
                <img 
                  src={product.image} 
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div className="project-content">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="project-tags" style={{ marginBottom: '1rem' }}>
                  <span className="tag">{product.category}</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '1rem',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid var(--surface0)'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: 'var(--blue)'
                  }}>
                    <FiDollarSign size={24} />
                    {product.price}
                  </div>
                  <div style={{ color: 'var(--subtext0)', fontSize: '0.9rem' }}>
                    {product.sales} sales
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    className="btn btn-secondary"
                    style={{ 
                      padding: '8px 16px',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      flex: 1
                    }}
                  >
                    <FiEdit size={16} /> Edit
                  </button>
                  <button 
                    className="btn"
                    style={{ 
                      padding: '8px 16px',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: 'var(--red)',
                      color: 'white'
                    }}
                  >
                    <FiTrash2 size={16} /> Delete
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

export default MyProducts;
