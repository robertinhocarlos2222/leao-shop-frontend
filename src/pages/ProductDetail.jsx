import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiShoppingCart, HiArrowLeft, HiCheck, HiStar, HiLightningBolt } from 'react-icons/hi';
import { getProduct, getProducts } from '../services/api';
import { useCart } from '../context/CartContext';

function formatPrice(cents) {
  return `R$ ${(cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    loadProduct();
    window.scrollTo(0, 0);
  }, [id]);

  async function loadProduct() {
    setLoading(true);
    try {
      const data = await getProduct(parseInt(id));
      setProduct(data);
      if (data.flavors && data.flavors.length > 0) {
        setSelectedFlavor(data.flavors[0]);
      }
      // Load related products
      const related = await getProducts({ brand: data.brand, limit: 4 });
      setRelatedProducts((related.data || []).filter(p => p.id !== data.id).slice(0, 4));
    } catch (error) {
      console.error('Erro ao carregar produto:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleAddToCart() {
    if (!product) return;
    addToCart(product, quantity, selectedFlavor || null);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }

  if (loading) {
    return (
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-dark-800 rounded-3xl animate-pulse" />
            <div className="space-y-4">
              <div className="h-8 bg-dark-800 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-dark-800 rounded w-1/2 animate-pulse" />
              <div className="h-12 bg-dark-800 rounded w-1/3 animate-pulse mt-6" />
              <div className="h-20 bg-dark-800 rounded animate-pulse mt-6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-24 pb-20 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-heading font-bold text-white mb-2">Produto não encontrado</h2>
        <Link to="/produtos" className="btn-primary inline-flex items-center gap-2 mt-4">
          <HiArrowLeft /> Voltar
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link to="/produtos" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary-400 transition-colors mb-8">
          <HiArrowLeft /> Voltar para Produtos
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="aspect-square bg-gradient-to-br from-dark-800 to-dark-900 rounded-3xl overflow-hidden border border-dark-700">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain p-12 hover:scale-110 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl">
                  📦
                </div>
              )}
            </div>
            {product.badge && (
              <span className={`absolute top-4 right-4 ${
                product.badge === 'LANÇAMENTO' ? 'badge-new' :
                product.badge === 'PRÉ-VENDA' ? 'badge-pre' :
                product.badge === 'KIT' ? 'badge-kit' : 'badge-promo'
              } text-sm px-4 py-2`}>
                {product.badge}
              </span>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Brand & Name */}
            <div>
              <p className="text-primary-400 font-medium text-sm uppercase tracking-wider">{product.brand}</p>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mt-1">{product.name}</h1>
            </div>

            {/* Specs */}
            <div className="flex flex-wrap gap-3">
              {product.puffs && (
                <span className="px-4 py-2 bg-dark-800 rounded-lg text-sm text-gray-300 border border-dark-700">
                  🔥 {product.puffs.toLocaleString()} Puffs
                </span>
              )}
              {product.battery && (
                <span className="px-4 py-2 bg-dark-800 rounded-lg text-sm text-gray-300 border border-dark-700">
                  🔋 {product.battery}
                </span>
              )}
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-heading font-bold text-primary-400">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-600 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="bg-red-500/20 text-red-400 text-sm font-bold px-3 py-1 rounded-full">
                    -{Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </span>
                )}
              </div>
              {product.installments && (
                <p className="text-gray-400">
                  ou <span className="text-white font-semibold">{product.installments.times}x de {formatPrice(product.installments.value)}</span> sem juros
                </p>
              )}
              <p className="text-green-400 text-sm flex items-center gap-1">
                <HiLightningBolt /> PIX: Aprovação instantânea
              </p>
            </div>

            {/* Flavors */}
            {product.flavors && product.flavors.length > 0 && (
              <div>
                <h3 className="text-white font-heading font-semibold mb-3">Sabores Disponíveis</h3>
                <div className="flex flex-wrap gap-2">
                  {product.flavors.map((flavor) => (
                    <button
                      key={flavor}
                      onClick={() => setSelectedFlavor(flavor)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedFlavor === flavor
                          ? 'bg-primary-500/20 text-primary-400 border border-primary-500/50'
                          : 'bg-dark-800 text-gray-400 border border-dark-700 hover:border-primary-500/30 hover:text-primary-400'
                      }`}
                    >
                      {flavor}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="space-y-4 pt-4 border-t border-dark-700">
              <div className="flex items-center gap-4">
                <span className="text-gray-400">Quantidade:</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 bg-dark-800 border border-dark-700 rounded-lg text-white hover:border-primary-500/30 transition-all"
                  >
                    -
                  </button>
                  <span className="text-white font-medium text-lg w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 bg-dark-800 border border-dark-700 rounded-lg text-white hover:border-primary-500/30 transition-all"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                  addedToCart
                    ? 'bg-green-500 text-white'
                    : 'btn-primary'
                }`}
              >
                {addedToCart ? (
                  <><HiCheck /> Adicionado ao Carrinho!</>
                ) : (
                  <><HiShoppingCart /> Adicionar ao Carrinho</>
                )}
              </button>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              {[
                { icon: '✅', text: 'Produto Original' },
                { icon: '🚚', text: 'Entrega Rápida' },
                { icon: '🔒', text: 'Compra Segura' },
                { icon: '💳', text: 'Parcele no Cartão' },
              ].map((benefit) => (
                <div key={benefit.text} className="flex items-center gap-2 text-sm text-gray-400">
                  <span>{benefit.icon}</span>
                  <span>{benefit.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <h2 className="section-title mb-8">
              Produtos <span className="gradient-text">Relacionados</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relProduct) => (
                <Link key={relProduct.id} to={`/produto/${relProduct.id}`} className="card-hover block group">
                  <div className="relative aspect-square bg-gradient-to-br from-dark-700 to-dark-800 rounded-2xl overflow-hidden mb-4">
                    {relProduct.image ? (
                      <img src={relProduct.image} alt={relProduct.name} className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
                    )}
                  </div>
                  <h3 className="text-white font-heading font-semibold group-hover:text-primary-400 transition-colors text-sm">{relProduct.name}</h3>
                  <span className="text-primary-400 font-heading font-bold">{formatPrice(relProduct.price)}</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}