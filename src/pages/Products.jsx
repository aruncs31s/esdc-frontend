import { useState } from 'react';
import { FiShoppingCart, FiDollarSign } from 'react-icons/fi';

const Products = () => {
  const [products] = useState([
    {
      id: 1,
      name: 'Arduino Starter Kit',
      price: 45.99,
      image: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=400&h=300&fit=crop',
      description: 'Complete Arduino starter kit with sensors, LEDs, and components',
      category: 'Hardware'
    },
    {
      id: 2,
      name: 'Raspberry Pi 4',
      price: 75.00,
      image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&h=300&fit=crop',
      description: 'Raspberry Pi 4 Model B with 4GB RAM',
      category: 'Hardware'
    },
    {
      id: 3,
      name: 'ESP32 Development Board',
      price: 12.99,
      image: 'https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=400&h=300&fit=crop',
      description: 'WiFi and Bluetooth enabled microcontroller',
      category: 'Hardware'
    },
    {
      id: 4,
      name: 'Sensor Kit',
      price: 29.99,
      image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop',
      description: '37-in-1 sensor module kit for Arduino',
      category: 'Components'
    },
    {
      id: 5,
      name: 'Soldering Station',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop',
      description: 'Digital temperature controlled soldering station',
      category: 'Tools'
    },
    {
      id: 6,
      name: 'Breadboard Set',
      price: 15.99,
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
      description: 'Solderless breadboard with jumper wires',
      category: 'Components'
    }
  ]);

  const handleBuy = (product) => {
    alert(`Purchasing ${product.name} for $${product.price}`);
  };

  return (
    <section className="products-section" style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '60px' }}>
      <div className="container">
        <div className="section-header">
          <h2>Our Products</h2>
          <p>Quality electronics and components for your embedded systems projects</p>
        </div>

        <div className="projects-grid">
          {products.map((product) => (
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
                  marginTop: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--surface0)'
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
                  <button 
                    onClick={() => handleBuy(product)}
                    className="btn btn-primary"
                    style={{ 
                      padding: '10px 20px',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <FiShoppingCart /> Buy Now
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

export default Products;
