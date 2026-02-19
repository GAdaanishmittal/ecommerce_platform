import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatters';

const ProductCard = ({ product, onAddToCart, canEdit = false }) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const isOutOfStock = product.stockQty === 0;

  return (
    <div className="product-card">
      <div className="product-image-container">
        {product.picture && !imgError ? (
          <img
            src={product.picture}
            alt={product.productName}
            loading="lazy"
            onError={() => setImgError(true)}
            className="product-image"
          />
        ) : (
          <span className="mono section-meta">NO_IMAGE</span>
        )}
        {product.sku && <div className="product-sku mono">{product.sku}</div>}
        {isOutOfStock && <div className="product-flag mono">SOLD_OUT</div>}
      </div>

      <div className="product-info">
        <Link to={`/products/${product.productId}`} className="product-title">
          {product.productName}
        </Link>

        <div className="product-price">{formatCurrency(product.basePrice)}</div>

        <div className="product-card-actions">
          <button onClick={() => onAddToCart(product.productId)} disabled={isOutOfStock}>
            {isOutOfStock ? 'EMPTY' : 'ADD'}
          </button>
          {canEdit && (
            <button onClick={() => navigate(`/products/${product.productId}/edit`)} className="secondary">
              EDIT
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
