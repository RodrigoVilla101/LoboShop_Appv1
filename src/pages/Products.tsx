import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonSearchbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonChip,
  IonLabel,
  IonFab,
  IonFabButton,
  IonCard,
  IonCardContent,
  IonText,
  IonSpinner,
} from '@ionic/react';
import {
  addOutline,
  homeOutline,
  alertCircleOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { productService, categoryService } from '../services/api';
import { Product, Category } from '../types/product.types';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import ProductCard from '../components/ProductCard';
import './Products.css';

const Products: React.FC = () => {
  const history = useHistory();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    console.log('🔄 Iniciando carga de datos...');
    setLoading(true);
    setError('');

    try {
      // Cargar categorías
      console.log('📂 Cargando categorías...');
      const cats = await categoryService.getAll();
      console.log('✅ Categorías cargadas:', cats.length);
      setCategories(cats);

      // Cargar productos
      console.log('📦 Cargando productos...');
      const response = await productService.getAll({ page: 1, limit: 20 });
      console.log('✅ Productos cargados:', response);
      console.log('📊 Total de productos:', response.count);

      if (response.productos && Array.isArray(response.productos)) {
        setProducts(response.productos);
        console.log('✅ Productos guardados en estado:', response.productos.length);
      } else {
        console.error('❌ Respuesta inválida:', response);
        setError('Respuesta inválida del servidor');
      }
    } catch (err) {
      console.error('❌ Error al cargar datos:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar datos';
      setError(errorMessage);
    } finally {
      console.log('✅ Carga finalizada, ocultando loading');
      setLoading(false);
    }
  };

  const handleCategoryFilter = (categoryId: string) => {
    setSelectedCategory(categoryId);
    loadFilteredProducts(categoryId, searchText);
  };

  const loadFilteredProducts = async (categoryId: string, search: string) => {
    try {
      setLoading(true);
      type ProductFilters = {
        page?: number;
        limit?: number;
        categoria?: string;
        busqueda?: string;
      };
      const filters: ProductFilters = { page: 1, limit: 20 };
      if (categoryId) filters.categoria = categoryId;
      if (search) filters.busqueda = search;

      const response = await productService.getAll(filters);
      setProducts(response.productos);
    } catch (err) {
      console.error('Error al filtrar:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSearchText('');
    loadInitialData();
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(price);
  };

  console.log('🎨 Renderizando componente, loading:', loading, 'products:', products.length, 'error:', error);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>🐺 LoboShop</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => history.push('/home')}>
              <IonIcon icon={homeOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            value={searchText}
            onIonChange={(e) => setSearchText(e.detail.value || '')}
            placeholder="Buscar productos..."
          />
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* Mostrar loading */}
        {loading && <LoadingState message="Cargando productos..." />}

        {/* Mostrar error */}
        {!loading && error && (
          <ErrorState
            title="Error al cargar productos"
            message={error}
            onRetry={loadInitialData}
          />
        )}

        {/* Mostrar contenido cuando NO está cargando y NO hay error */}
        {!loading && !error && (
          <>
            {/* Filtros de categorías */}
            <div className="category-filters">
              <IonChip
                color={!selectedCategory ? 'primary' : 'medium'}
                onClick={clearFilters}
              >
                <IonLabel>Todas</IonLabel>
              </IonChip>
              {categories.map((cat) => (
                <IonChip
                  key={cat._id}
                  color={selectedCategory === cat._id ? 'primary' : 'medium'}
                  onClick={() => handleCategoryFilter(cat._id)}
                >
                  <IonLabel>{cat.nombre}</IonLabel>
                </IonChip>
              ))}
            </div>

            {/* Lista de productos */}
            {products.length === 0 ? (
              <IonCard>
                <IonCardContent className="ion-text-center">
                  <h2>📦 No hay productos disponibles</h2>
                  <p>Sé el primero en publicar un producto</p>
                  <IonButton
                    onClick={() => history.push('/crear-producto')}
                    color="primary"
                  >
                    <IonIcon icon={addOutline} slot="start" />
                    Publicar Producto
                  </IonButton>
                </IonCardContent>
              </IonCard>
            ) : (
              <>
                <div style={{ padding: '10px', background: 'var(--ion-color-light)', borderRadius: '8px', marginBottom: '10px' }}>
                  <IonText color="medium">
                    <strong>Mostrando {products.length} productos</strong>
                  </IonText>
                </div>

                <IonGrid>
                  <IonRow>
                    {products.map((product) => (
                      <IonCol size="12" sizeMd="6" sizeLg="4" key={product._id}>
                        <ProductCard product={product} />
                      </IonCol>
                    ))}
                  </IonRow>
                </IonGrid>
              </>
            )}
          </>
        )}

        {/* Botón flotante */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => history.push('/crear-producto')}>
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Products;
