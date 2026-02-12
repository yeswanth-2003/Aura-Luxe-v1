
import React, { useState, useEffect } from 'react';
import { ProductWithPrice, CartItem } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import GiftConcierge from './components/GiftConcierge';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import { api } from './services/api';

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(api.isAdmin());
  const [allProducts, setAllProducts] = useState<ProductWithPrice[]>([]);

  // Fetch all products on mount for AI context and global use
  useEffect(() => {
    api.getAllProducts().then(setAllProducts);
  }, []);

  // Listen for /admin via URL hash change
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setCurrentPath('admin');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Check on mount
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (path: string) => {
    if (path !== 'admin') window.location.hash = '';
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  const addToCart = (product: ProductWithPrice) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const renderContent = () => {
    switch (currentPath) {
      case 'home': return <Home onNavigate={handleNavigate} />;
      case 'shop': return <Shop onProductClick={(id) => { setSelectedProductId(id); handleNavigate('product-detail'); }} />;
      case 'product-detail': return selectedProductId ? <ProductDetail productId={selectedProductId} onAddToCart={addToCart} /> : <Shop onProductClick={(id) => { setSelectedProductId(id); handleNavigate('product-detail'); }} />;
      case 'cart': return <Cart items={cart} onRemove={(id) => setCart(c => c.filter(i => i.id !== id))} onUpdateQty={(id, delta) => setCart(c => c.map(i => i.id === id ? {...i, quantity: Math.max(1, i.quantity + delta)} : i))} onNavigate={handleNavigate} />;
      case 'admin': return isAdminAuthenticated ? <AdminDashboard /> : <AdminLogin onLogin={() => setIsAdminAuthenticated(true)} />;
      default: return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <Header cartCount={cart.reduce((a, b) => a + b.quantity, 0)} onNavigate={handleNavigate} />
      <main className="flex-grow">{renderContent()}</main>
      <Footer onNavigate={handleNavigate} />
      
      {/* AI Gift Concierge accessible across the site */}
      <GiftConcierge 
        products={allProducts} 
        onNavigateToProduct={(id) => { setSelectedProductId(id); handleNavigate('product-detail'); }} 
      />
    </div>
  );
};

export default App;
