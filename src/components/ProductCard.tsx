import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiStar } from 'react-icons/fi';
import { useShop } from '../contexts/ShopContext';
import './ProductCard.css';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  stock: number;
  rating: number;
  [key: string]: any;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, addToWishlist, wishlist } = useShop();

  const isInWishlist = wishlist.some((item) => item.id === product.id);

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking buttons
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) return;
    navigate(`/product/${product.id}`);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToWishlist(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };

  return (
    <article className="product-card" onClick={handleCardClick}>
      {/* Image Section */}
      <div className="product-card-image">
        <img src={product.image} alt={product.name} loading="lazy" />

        <button
          className={`product-card-wishlist ${isInWishlist ? 'active' : ''}`}
          onClick={handleWishlistClick}
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <FiHeart fill={isInWishlist ? 'currentColor' : 'none'} />
        </button>

        {product.stock === 0 && (
          <span className="product-card-badge out-of-stock">Out of Stock</span>
        )}
        {product.stock > 0 && product.stock < 5 && (
          <span className="product-card-badge low-stock">Low Stock</span>
        )}
      </div>

      {/* Content Body */}
      <div className="product-card-body">
        <div className="product-card-header">
          <h3 className="product-card-title" onClick={handleViewDetails}>
            {product.name}
          </h3>
        </div>

        <p className="product-card-desc">{product.description}</p>

        <div className="product-card-meta">
          <div className="product-card-tag">
            <span className="product-card-dot"></span>
            {product.category}
          </div>

          {product.rating > 0 && (
            <div className="product-card-rating">
              <FiStar fill="currentColor" />
              <span>{product.rating}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="product-card-footer">
        <div className="product-card-price">${product.price.toFixed(2)}</div>

        <div className="product-card-actions">
          <button
            className="product-card-btn product-card-btn-cart"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            aria-label="Add to cart"
          >
            <FiShoppingCart />
          </button>
          <button className="product-card-btn product-card-btn-view" onClick={handleViewDetails}>
            View
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
