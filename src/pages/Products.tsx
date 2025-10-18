import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../contexts/ShopContext';
import { mockProducts } from '../data/mockProducts';

const Products = () => {
  const navigate = useNavigate();
  const { addToCart, addToWishlist, wishlist } = useShop();
  const products = mockProducts;

  const isInWishlist = (productId: number) => wishlist.some((item) => item.id === productId);

  return (
    <section
      className="products-section"
      style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '60px' }}
    >
      <div className="container">
        <div className="section-header">
          <h2>Our Products</h2>
          <p>Quality electronics and components for your embedded systems projects</p>
        </div>

        <div className="projects-grid">
          {products.map((product) => (
            <div key={product.id} className="project-card">
              <div
                className="project-image"
                style={{ position: 'relative', cursor: 'pointer' }}
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToWishlist(product);
                  }}
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
                    cursor: 'pointer',
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
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '1rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--surface0)',
                    gap: '0.5rem',
                  }}
                >
                  <div
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      color: 'var(--blue)',
                    }}
                  >
                    ${product.price}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => addToCart(product)}
                      className="btn btn-primary"
                      style={{
                        padding: '10px 15px',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <FiShoppingCart size={16} /> Cart
                    </button>
                    <button
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="btn btn-primary"
                      style={{
                        padding: '10px 15px',
                        fontSize: '0.85rem',
                      }}
                    >
                      View Details
                    </button>
                  </div>
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
