import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiMinus, HiPlus, HiShoppingCart, HiTrash } from 'react-icons/hi';
import { useCart } from '../context/CartContext';

function formatPrice(cents) {
  return `R$ ${(cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function CartSidebar() {
  const { cartItems, cartOpen, setCartOpen, removeFromCart, updateQuantity, cartTotal, cartCount, clearCart } = useCart();

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-black/60 z-50"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md z-50 bg-dark-800 border-l border-dark-700 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-dark-700">
              <div className="flex items-center gap-3">
                <HiShoppingCart className="text-primary-500" size={24} />
                <h2 className="text-lg font-heading font-bold text-white">
                  Carrinho
                </h2>
                {cartCount > 0 && (
                  <span className="bg-dark-700 text-gray-300 text-xs px-2 py-1 rounded-full">
                    {cartCount} {cartCount === 1 ? 'item' : 'itens'}
                  </span>
                )}
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <HiX size={22} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="text-6xl mb-4">🛒</div>
                  <h3 className="text-xl font-heading font-bold text-white mb-2">Carrinho vazio</h3>
                  <p className="text-gray-400 mb-6">Adicione produtos para começar</p>
                  <button
                    onClick={() => { setCartOpen(false); window.location.href = '/produtos'; }}
                    className="btn-primary"
                  >
                    Ver Produtos
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item, index) => (
                    <motion.div
                      key={`${item.id}-${item.flavor}-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      className="card p-4"
                    >
                      <div className="flex gap-4">
                        {/* Image placeholder */}
                        <div className="w-20 h-20 rounded-xl bg-dark-700 flex items-center justify-center shrink-0">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            <span className="text-2xl">📦</span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-white truncate">{item.name}</h4>
                          {item.flavor && (
                            <p className="text-xs text-primary-400 mt-0.5">Sabor: {item.flavor}</p>
                          )}
                          <p className="text-sm font-bold text-primary-400 mt-1">{formatPrice(item.price)}</p>

                          {/* Quantity controls */}
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.flavor, item.quantity - 1)}
                                className="p-1 bg-dark-700 rounded-md text-gray-400 hover:text-white transition-colors"
                              >
                                <HiMinus size={14} />
                              </button>
                              <span className="text-white text-sm font-medium w-6 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.flavor, item.quantity + 1)}
                                className="p-1 bg-dark-700 rounded-md text-gray-400 hover:text-white transition-colors"
                              >
                                <HiPlus size={14} />
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id, item.flavor)}
                              className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
                            >
                              <HiTrash size={16} />
                            </button>
                          </div>

                          <p className="text-xs text-gray-500 mt-1">
                            Subtotal: {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-dark-700 p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white font-medium">{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Frete</span>
                    <span className="text-green-400 font-medium">Grátis</span>
                  </div>
                  <div className="border-t border-dark-700 pt-2 flex items-center justify-between">
                    <span className="text-white font-heading font-bold">Total</span>
                    <span className="text-primary-400 font-heading font-bold text-xl">{formatPrice(cartTotal)}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={clearCart}
                    className="px-4 py-3 text-sm text-gray-400 hover:text-red-400 border border-dark-700 rounded-lg hover:border-red-500/30 transition-all"
                  >
                    Limpar
                  </button>
                  <Link
                    to="/checkout"
                    onClick={() => setCartOpen(false)}
                    className="flex-1 btn-primary text-center"
                  >
                    Finalizar Pedido
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}