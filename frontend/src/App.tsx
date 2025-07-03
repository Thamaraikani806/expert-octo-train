import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import ProductForm from './components/ProductForm';
import EditProductForm from './components/EditProductForm';
import Products from './components/Products';

function App() {
  const [page, setPage] = useState<'register' | 'login' | 'home' | 'add-product' | 'edit-product' | 'products'>('register');
  const [editProductId, setEditProductId] = useState<string>('');

  const showSuccessAndNavigate = (nextPage: typeof page) => {
    toast.success(`${nextPage === 'home' ? 'Login' : 'Product'} successful!`);
    setTimeout(() => setPage(nextPage), 1000);
  };

  const handleGoToEdit = (id: string) => {
    setEditProductId(id);
    setPage('edit-product');
  };

  return (
    <div>
      {(page === 'register' || page === 'login') && (
        <>
          <h1>{page === 'login' ? 'Login' : 'Register'} Form</h1>
          <button onClick={() => setPage(page === 'login' ? 'register' : 'login')}>
            {page === 'login' ? 'Go to Register' : 'Go to Login'}
          </button>
        </>
      )}

      {page === 'register' && <Register />}
      {page === 'login' && <Login onLoginSuccess={() => showSuccessAndNavigate('home')} />}
      {page === 'home' && (
        <Home
          goToAddProduct={() => setPage('add-product')}
          goToProductView={() => setPage('products')}
          goToEditProduct={(id) => handleGoToEdit(id)}
        />
      )}
      {page === 'add-product' && <ProductForm goHome={() => setPage('home')} />}
      {page === 'edit-product' && editProductId && (<EditProductForm id={editProductId} goHome={() => setPage('home')} />)}
      {page === 'products' && <Products goBack={() => setPage('home')} />}
      <Toaster />
    </div>
  );
}

export default App;

