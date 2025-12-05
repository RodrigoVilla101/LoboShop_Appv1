import React from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonChip,
  IonIcon,
  IonBadge,
} from '@ionic/react';
import { eyeOutline, imageOutline } from 'ionicons/icons';
import { Product } from '../types/product.types';
import { useHistory } from 'react-router-dom';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const history = useHistory();
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
  // Base URL for images (usually root of backend, not api/v1)
  const baseUrl = apiUrl.replace('/api/v1', '');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(price);
  };

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case 'nuevo':
        return 'success';
      case 'como_nuevo':
        return 'primary';
      case 'usado':
        return 'warning';
      default:
        return 'medium';
    }
  };

  const handleClick = () => {
    history.push(`/producto/${product._id}`);
  };

  return (
    <IonCard className="product-card" button onClick={handleClick}>
      <div className="product-image-container">
        {product.imagenes && product.imagenes.length > 0 ? (
          <img
            src={`${baseUrl}${product.imagenes[0].url}`}
            alt={product.nombre}
            className="product-image"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : (
          <div className="product-no-image">
            <IonIcon icon={imageOutline} style={{ fontSize: '64px' }} />
            <p>Sin imagen</p>
          </div>
        )}
        {/* Fallback for broken images */}
        <div className="product-no-image hidden">
          <IonIcon icon={imageOutline} style={{ fontSize: '64px' }} />
          <p>Sin imagen</p>
        </div>

        <IonBadge color={getEstadoBadgeColor(product.estado)} className="estado-badge">
          {product.estado.replace('_', ' ')}
        </IonBadge>
      </div>

      <IonCardHeader>
        <IonCardTitle>{product.nombre}</IonCardTitle>
        <IonCardSubtitle className="price">{formatPrice(product.precio)}</IonCardSubtitle>
      </IonCardHeader>

      <IonCardContent>
        <p className="description">{product.descripcion}</p>
        <div className="product-meta">
          <IonChip outline color="primary">
            <IonIcon icon={product.categoria?.icono || imageOutline} />
            <IonBadge color="light">{product.categoria?.nombre || 'General'}</IonBadge>
          </IonChip>
        </div>
        <div className="seller-info">
          <IonIcon icon={eyeOutline} /> {product.vistas} vistas
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default ProductCard;
