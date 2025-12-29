import { useState } from 'react';
import { FiTrash2, FiShoppingBag, FiHeart, FiPackage } from 'react-icons/fi';
import { useShop } from '../contexts/ShopContext';

const ShopCart = () => {
  const {
    cart,
    wishlist,
    orders,
    removeFromCart,
    updateQuantity,
    removeFromWishlist,
    addToCart,
    checkout,
    cartTotal,
  } = useShop();
  const [activeTab, setActiveTab] = useState<'cart' | 'wishlist' | 'orders'>('cart');

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    if (window.confirm(`Proceed with checkout? Total: $${cartTotal.toFixed(2)}`)) {
      checkout();
      alert('Order placed successfully!');
    }
  };

  return (
    <section style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '60px' }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        <div className="section-header">
          <h2>My Shop</h2>
          <p>Manage your cart, wishlist, and orders</p>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '2rem',
            borderBottom: '2px solid var(--surface0)',
          }}
        >
          <button
            onClick={() => setActiveTab('cart')}
            style={{
              padding: '1rem 2rem',
              background: activeTab === 'cart' ? 'var(--blue)' : 'transparent',
              color: activeTab === 'cart' ? 'var(--base)' : 'var(--text)',
              border: 'none',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <FiShoppingBag /> Cart ({cart.length})
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            style={{
              padding: '1rem 2rem',
              background: activeTab === 'wishlist' ? 'var(--blue)' : 'transparent',
              color: activeTab === 'wishlist' ? 'var(--base)' : 'var(--text)',
              border: 'none',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <FiHeart /> Wishlist ({wishlist.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '1rem 2rem',
              background: activeTab === 'orders' ? 'var(--blue)' : 'transparent',
              color: activeTab === 'orders' ? 'var(--base)' : 'var(--text)',
              border: 'none',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <FiPackage /> Orders ({orders.length})
          </button>
        </div>

        {activeTab === 'cart' && (
          <div>
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--subtext0)' }}>
                <FiShoppingBag size={64} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <p>Your cart is empty</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="glass-card"
                      style={{
                        padding: '1.5rem',
                        display: 'flex',
                        gap: '1.5rem',
                        alignItems: 'center',
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: '100px',
                          height: '100px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <h3 style={{ marginBottom: '0.5rem' }}>{item.name}</h3>
                        <p style={{ color: 'var(--subtext0)', fontSize: '0.9rem' }}>
                          {item.description}
                        </p>
                        <p style={{ color: 'var(--blue)', fontWeight: '700', marginTop: '0.5rem' }}>
                          ${item.price}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            style={{
                              padding: '0.5rem 1rem',
                              background: 'var(--surface0)',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              color: 'var(--text)',
                            }}
                          >
                            -
                          </button>
                          <span
                            style={{ minWidth: '30px', textAlign: 'center', fontWeight: '600' }}
                          >
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            style={{
                              padding: '0.5rem 1rem',
                              background: 'var(--surface0)',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              color: 'var(--text)',
                            }}
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          style={{
                            padding: '0.5rem',
                            background: 'var(--red)',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            color: 'white',
                          }}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="glass-card" style={{ marginTop: '2rem', padding: '1.5rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1rem',
                    }}
                  >
                    <h3>Total:</h3>
                    <h2 style={{ color: 'var(--blue)' }}>${cartTotal.toFixed(2)}</h2>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
                  >
                    Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'wishlist' && (
          <div>
            {wishlist.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--subtext0)' }}>
                <FiHeart size={64} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <p>Your wishlist is empty</p>
              </div>
            ) : (
              <div className="projects-grid">
                {wishlist.map((item) => (
                  <div key={item.id} className="project-card">
                    <div className="project-image">
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div className="project-content">
                      <h3>{item.name}</h3>
                      <p>{item.description}</p>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginTop: '1rem',
                          paddingTop: '1rem',
                          borderTop: '1px solid var(--surface0)',
                        }}
                      >
                        <div
                          style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--blue)' }}
                        >
                          ${item.price}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => addToCart(item)}
                            className="btn btn-primary"
                            style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                          >
                            Add to Cart
                          </button>
                          <button
                            onClick={() => removeFromWishlist(item.id)}
                            style={{
                              padding: '10px',
                              background: 'var(--red)',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              color: 'white',
                            }}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--subtext0)' }}>
                <FiPackage size={64} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <p>No orders yet</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {orders.map((order, orderIndex) => {
                  const orderTotal = order.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                  );
                  return (
                    <div key={orderIndex} className="glass-card" style={{ padding: '1.5rem' }}>
                      <h3 style={{ marginBottom: '1rem' }}>Order #{orderIndex + 1}</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {order.map((item) => (
                          <div
                            key={item.id}
                            style={{
                              display: 'flex',
                              gap: '1rem',
                              alignItems: 'center',
                              padding: '1rem',
                              background: 'var(--surface0)',
                              borderRadius: '8px',
                            }}
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              style={{
                                width: '60px',
                                height: '60px',
                                objectFit: 'cover',
                                borderRadius: '4px',
                              }}
                            />
                            <div style={{ flex: 1 }}>
                              <h4>{item.name}</h4>
                              <p style={{ color: 'var(--subtext0)', fontSize: '0.9rem' }}>
                                Quantity: {item.quantity}
                              </p>
                            </div>
                            <div style={{ fontWeight: '700', color: 'var(--blue)' }}>
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div
                        style={{
                          marginTop: '1rem',
                          paddingTop: '1rem',
                          borderTop: '1px solid var(--surface0)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <h3>Order Total:</h3>
                        <h2 style={{ color: 'var(--blue)' }}>${orderTotal.toFixed(2)}</h2>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ShopCart;
