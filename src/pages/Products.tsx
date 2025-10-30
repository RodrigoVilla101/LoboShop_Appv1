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
        {loading && (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '400px',
            background: 'white',
            borderRadius: '8px',
            margin: '20px'
          }}>
            <IonSpinner name="crescent" style={{ transform: 'scale(1.5)' }} />
            <p style={{ marginTop: '20px' }}>Cargando productos...</p>
          </div>
        )}

        {/* Mostrar error */}
        {!loading && error && (
          <IonCard color="danger">
            <IonCardContent>
              <div style={{ textAlign: 'center' }}>
                <IonIcon icon={alertCircleOutline} style={{ fontSize: '48px' }} />
                <h2>Error al cargar productos</h2>
                <p>{error}</p>
                <IonButton onClick={loadInitialData} color="light">
                  Reintentar
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>
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
                <div style={{ padding: '10px', background: '#f0f0f0', borderRadius: '8px', marginBottom: '10px' }}>
                  <strong>Mostrando {products.length} productos</strong>
                </div>
                
                <IonGrid>
                  <IonRow>
                    {products.map((product) => (
                      <IonCol size="12" sizeMd="6" sizeLg="4" key={product._id}>
                        <IonCard 
                          button 
                          onClick={() => {
                            console.log('Click en producto:', product._id);
                            history.push(`/producto/${product._id}`);
                          }}
                          style={{ height: '100%' }}
                        >
                          {product.imagenes && product.imagenes.length > 0 ? (
                            <img
                              src={`http://localhost:3000${product.imagenes[0].url}`}
                              alt={product.nombre}
                              style={{ 
                                height: '200px', 
                                objectFit: 'cover', 
                                width: '100%',
                                background: '#f5f5f5'
                              }}
                              onError={(e) => {
                                console.error('Error cargando imagen:', product.imagenes[0].url);
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div style={{
                              height: '200px',
                              background: '#f5f5f5',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <IonText color="medium">Sin imagen</IonText>
                            </div>
                          )}
                          
                          <IonCardContent>
                            <h2 style={{ 
                              margin: '0 0 10px 0', 
                              fontSize: '1.2rem',
                              fontWeight: 'bold'
                            }}>
                              {product.nombre}
                            </h2>
                            
                            <p style={{ 
                              color: 'var(--ion-color-primary)', 
                              fontSize: '1.4rem', 
                              fontWeight: 'bold',
                              margin: '10px 0'
                            }}>
                              {formatPrice(product.precio)}
                            </p>
                            
                            <p style={{ 
                              color: 'var(--ion-color-medium)',
                              fontSize: '0.9rem',
                              margin: '10px 0',
                              lineHeight: '1.4'
                            }}>
                              {product.descripcion}
                            </p>
                            
                            <div style={{ 
                              marginTop: '10px',
                              paddingTop: '10px',
                              borderTop: '1px solid #e0e0e0'
                            }}>
                              <IonText color="medium">
                                <small>
                                  <strong>Vendedor:</strong> {product.vendedor.nombre}
                                </small>
                              </IonText>
                            </div>
                          </IonCardContent>
                        </IonCard>
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
