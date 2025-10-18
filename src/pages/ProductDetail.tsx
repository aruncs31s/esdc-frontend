import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiStar, FiCheck, FiTag } from 'react-icons/fi';
import { useShop } from '../contexts/ShopContext';
import { mockProducts } from '../data/mockProducts';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, addToWishlist, wishlist, removeFromWishlist } = useShop();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponMessage, setCouponMessage] = useState('');

  const product = mockProducts.find((p) => p.id === Number(id));
  const relatedProducts =
    product?.relatedProductIds
      .map((relId) => mockProducts.find((p) => p.id === relId))
      .filter(Boolean) || [];

  if (!product) {
    return (
      <section className="product-detail-section">
        <div className="container">
          <div className="not-found">
            <h2>Product Not Found</h2>
            <button onClick={() => navigate('/products')} className="btn btn-primary">
              Back to Products
            </button>
          </div>
        </div>
      </section>
    );
  }

  const isInWishlist = wishlist.some((item) => item.id === product.id);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    alert(`Added ${quantity} item(s) to cart!`);
    setQuantity(1);
  };

  const handleToggleWishlist = () => {
    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleApplyCoupon = (couponCode: string) => {
    setAppliedCoupon(couponCode);
    setCouponMessage(`Coupon "${couponCode}" applied successfully!`);
    setTimeout(() => setCouponMessage(''), 3000);
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    const coupon = product.coupons.find((c) => c.code === appliedCoupon);
    if (!coupon) return 0;
    if (coupon.type === 'percentage') {
      return (product.price * coupon.discount) / 100;
    }
    return coupon.discount;
  };

  const finalPrice = Math.max(0, product.price - calculateDiscount());

  return (
    <section className="product-detail-section">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <a onClick={() => navigate('/products')} style={{ cursor: 'pointer' }}>
            Products
          </a>
          <span>/</span>
          <span>{product.name}</span>
        </div>

        {/* Main Product Section */}
        <div className="product-detail-main">
          {/* Image Gallery */}
          <div className="image-gallery">
            <div className="main-image">
              <img src={product.images[selectedImage]} alt={product.name} />
            </div>
            <div className="thumbnail-images">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${product.name} ${idx + 1}`}
                  className={`thumbnail ${selectedImage === idx ? 'active' : ''}`}
                  onClick={() => setSelectedImage(idx)}
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info">
            <h1>{product.name}</h1>

            {/* Rating */}
            <div className="product-rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    size={18}
                    fill={i < Math.floor(product.rating) ? 'var(--yellow)' : 'none'}
                    color={i < Math.floor(product.rating) ? 'var(--yellow)' : 'currentColor'}
                  />
                ))}
              </div>
              <span className="rating-value">{product.rating.toFixed(1)}</span>
              <span className="review-count">({product.reviewCount} reviews)</span>
            </div>

            {/* Price Section */}
            <div className="price-section">
              <div className="price-container">
                <span className="current-price">${finalPrice.toFixed(2)}</span>
                {appliedCoupon && (
                  <span className="original-price">${product.price.toFixed(2)}</span>
                )}
              </div>
              <div className="stock-status">
                {product.stock > 0 ? (
                  <span className="in-stock">In Stock ({product.stock} available)</span>
                ) : (
                  <span className="out-of-stock">Out of Stock</span>
                )}
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="product-actions">
              <div className="quantity-control">
                <label>Quantity:</label>
                <div className="quantity-selector">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                  <button onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="btn btn-primary"
                disabled={product.stock === 0}
              >
                <FiShoppingCart /> Add to Cart
              </button>

              <button
                onClick={handleToggleWishlist}
                className={`btn btn-wishlist ${isInWishlist ? 'active' : ''}`}
              >
                <FiHeart fill={isInWishlist ? 'currentColor' : 'none'} />
                {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
              </button>
            </div>

            {/* Coupons Section */}
            <div className="coupons-section">
              <h3>Available Coupons</h3>
              <div className="coupons-list">
                {product.coupons.map((coupon) => (
                  <div
                    key={coupon.code}
                    className={`coupon-card ${appliedCoupon === coupon.code ? 'applied' : ''}`}
                  >
                    <div className="coupon-info">
                      <div className="coupon-code">
                        <FiTag size={16} />
                        <code>{coupon.code}</code>
                      </div>
                      <p className="coupon-description">{coupon.description}</p>
                      <p className="coupon-discount">
                        {coupon.type === 'percentage'
                          ? `${coupon.discount}%`
                          : `$${coupon.discount}`}{' '}
                        off
                      </p>
                    </div>
                    <button
                      onClick={() => handleApplyCoupon(coupon.code)}
                      className={`coupon-btn ${appliedCoupon === coupon.code ? 'active' : ''}`}
                    >
                      {appliedCoupon === coupon.code ? (
                        <>
                          <FiCheck size={16} /> Applied
                        </>
                      ) : (
                        'Apply'
                      )}
                    </button>
                  </div>
                ))}
              </div>
              {couponMessage && <div className="coupon-message">{couponMessage}</div>}
            </div>

            <p className="product-description">{product.description}</p>
          </div>
        </div>

        {/* Features and Specs Section */}
        <div className="product-details-section">
          <div className="features-box">
            <h3>Features</h3>
            <ul className="features-list">
              {product.features.map((feature, idx) => (
                <li key={idx}>
                  <FiCheck size={18} color="var(--green)" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="specs-box">
            <h3>Specifications</h3>
            <div className="specs-table">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="spec-row">
                  <div className="spec-label">{key}</div>
                  <div className="spec-value">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="reviews-section">
          <h2>Customer Reviews</h2>

          <div className="reviews-summary">
            <div className="rating-summary">
              <div className="average-rating">
                <div className="rating-number">{product.rating.toFixed(1)}</div>
                <div className="rating-stars">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      size={20}
                      fill={i < Math.floor(product.rating) ? 'var(--yellow)' : 'none'}
                      color={i < Math.floor(product.rating) ? 'var(--yellow)' : 'currentColor'}
                    />
                  ))}
                </div>
                <div className="review-count">Based on {product.reviewCount} reviews</div>
              </div>
            </div>

            <div className="reviews-list">
              {product.reviews.map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div className="review-author">
                      <h4>{review.author}</h4>
                      {review.verified && (
                        <span className="verified-badge">
                          <FiCheck size={14} /> Verified Purchase
                        </span>
                      )}
                    </div>
                    <div className="review-date">{new Date(review.date).toLocaleDateString()}</div>
                  </div>

                  <div className="review-rating">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        size={16}
                        fill={i < review.rating ? 'var(--yellow)' : 'none'}
                        color={i < review.rating ? 'var(--yellow)' : 'currentColor'}
                      />
                    ))}
                  </div>

                  <h5 className="review-title">{review.title}</h5>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="related-products-section">
          <h2>Related Products</h2>
          {relatedProducts.length > 0 ? (
            <div className="related-products-grid">
              {relatedProducts.map((relProduct) => (
                <div key={relProduct?.id} className="related-product-card">
                  <div className="product-image">
                    <img src={relProduct?.image} alt={relProduct?.name} />
                  </div>
                  <div className="product-content">
                    <h4>{relProduct?.name}</h4>
                    <p className="category">{relProduct?.category}</p>
                    <div className="product-rating">
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            size={14}
                            fill={
                              i < Math.floor(relProduct?.rating || 0) ? 'var(--yellow)' : 'none'
                            }
                            color={
                              i < Math.floor(relProduct?.rating || 0)
                                ? 'var(--yellow)'
                                : 'currentColor'
                            }
                          />
                        ))}
                      </div>
                      <span>({relProduct?.reviewCount})</span>
                    </div>
                    <div className="product-footer">
                      <span className="price">${relProduct?.price.toFixed(2)}</span>
                      <button
                        onClick={() => navigate(`/product/${relProduct?.id}`)}
                        className="btn btn-small"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No related products found</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
