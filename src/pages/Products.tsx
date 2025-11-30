import { mockProducts } from '../data/mockProducts';
import ProductCard from '../components/ProductCard';
import '../styles/products.css';

const Products = () => {
  const products = mockProducts;

  return (
    <section className="products-page">
      <div className="container">
        <h1>Our Products</h1>
        <p>Quality electronics and components for your embedded systems projects</p>

        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
