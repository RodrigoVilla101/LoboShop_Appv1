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
    <IonCard className="product-card" onClick={handleClick}>
      <div className="product-image-container">
        {product.imagenes && product.imagenes.length > 0 ? (
          <img
            src={`http://localhost:3000${product.imagenes[0].url}`}
            alt={product.nombre}
            className="product-image"
          />
        ) : (
          <div className="product-no-image">
            <IonIcon icon={imageOutline} style={{ fontSize: '64px' }} />
            <p>Sin imagen</p>
          </div>
        )}
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
          <IonChip>
            <IonIcon icon={product.categoria.icono} />
            <span>{product.categoria.nombre}</span>
          </IonChip>
          <IonChip>
            <IonIcon icon={eyeOutline} />
            <span>{product.vistas} vistas</span>
          </IonChip>
        </div>
        <p className="seller">Vendedor: {product.vendedor.nombre}</p>
      </IonCardContent>
    </IonCard>
  );
};

export default ProductCard;
