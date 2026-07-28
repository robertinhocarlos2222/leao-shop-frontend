import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import Debug from './pages/Debug';

function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-dark-900 flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/produtos" element={<Products />} />
            <Route path="/produto/:id" element={<ProductDetail />} />
            <Route path="/checkout" element={<Checkout />} />
          <Route path="/sucesso" element={<Success />} />
          <Route path="/debug" element={<Debug />} />
          </Routes>
        </main>
        <Footer />
        <CartSidebar />
      </div>
    </CartProvider>
  );
}

export default App;