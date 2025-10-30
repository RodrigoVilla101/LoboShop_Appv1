import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact, IonSpinner } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { AuthProvider, useAuth } from './context/AuthContext';
import CreateProduct from './pages/CreateProduct';
import ProductDetail from './pages/ProductDetail';
import MyProducts from './pages/MyProducts';
import EditProduct from './pages/EditProduct';
import React from 'react';

/* Core CSS */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Pages */
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Products from './pages/Products';

setupIonicReact();

const AppRoutes: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <IonApp>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          flexDirection: 'column'
        }}>
          <IonSpinner name="crescent" style={{ transform: 'scale(2)' }} />
          <p style={{ marginTop: '20px' }}>Cargando...</p>
        </div>
      </IonApp>
    );
  }

  return (
    <IonReactRouter>
      <IonRouterOutlet>
        {/* Rutas públicas */}
        <Route exact path="/login">
          {isAuthenticated ? <Redirect to="/home" /> : <Login />}
        </Route>
        
        <Route exact path="/register">
          {isAuthenticated ? <Redirect to="/home" /> : <Register />}
        </Route>

        {/* Rutas protegidas */}
        <Route exact path="/home">
          {isAuthenticated ? <Home /> : <Redirect to="/login" />}
        </Route>

        <Route exact path="/profile">
          {isAuthenticated ? <Profile /> : <Redirect to="/login" />}
        </Route>

        <Route exact path="/productos">
          {isAuthenticated ? <Products /> : <Redirect to="/login" />}
        </Route>

        {/* Ruta por defecto */}
        <Route exact path="/">
          <Redirect to={isAuthenticated ? '/productos' : '/login'} />
        </Route>

        <Route exact path="/crear-producto">
          {isAuthenticated ? <CreateProduct /> : <Redirect to="/login" />}
        </Route>

        <Route exact path="/producto/:id">
          {isAuthenticated ? <ProductDetail /> : <Redirect to="/login" />}
        </Route>

        <Route exact path="/mis-productos">
          {isAuthenticated ? <MyProducts /> : <Redirect to="/login" />}
        </Route>
        <Route exact path="/editar-producto/:id">
          {isAuthenticated ? <EditProduct /> : <Redirect to="/login" />}
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  );
};

const App: React.FC = () => (
  <IonApp>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </IonApp>
);

export default App;


