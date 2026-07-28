import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiFilter, HiX, HiAdjustments } from 'react-icons/hi';
import { getProducts } from '../services/api';

function formatPrice(cents) {
  return `R$ ${(cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  const currentBrand = searchParams.get('brand') || '';
  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';

  const brands = ['Ignite', 'Elfbar', 'Oxbar', 'Outros'];
  const categories = [
    'Pods Descartáveis',
    'Kits Promocionais',
    'Baterias & Refis',
    'Juices Especiais',
    'Acessórios'
  ];

  useEffect(() => {
    loadProducts();
  }, [searchParams]);

  async function loadProducts() {
    setLoading(true);
    try {
      const params = {};
      if (currentBrand) params.brand = currentBrand;
      if (currentCategory) params.category = currentCategory;
      if (currentSearch) params.search = currentSearch;

      const data = await getProducts(params);
      setProducts(data.data || []);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  }

  function setFilter(key, value) {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  }

  function clearFilters() {
    setSearchParams({});
  }

  const hasFilters = currentBrand || currentCategory || currentSearch;

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-title"
          >
            {currentSearch ? (
              <>Resultados para: "<span className="gradient-text">{currentSearch}</span>"</>
            ) : currentBrand ? (
              <><span className="gradient-text">{currentBrand}</span></>
            ) : currentCategory ? (
              <><span className="gradient-text">{currentCategory}</span></>
            ) : (
              <>Todos os <span className="gradient-text">Produtos</span></>
            )}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="section-subtitle"
          >
            {products.length} {products.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
          </motion.p>
        </div>

        <div className="flex gap-8">
          {/* Mobile filter button */}
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="lg:hidden btn-outline fixed bottom-6 right-6 z-30 flex items-center gap-2 bg-dark-800 shadow-xl"
          >
            <HiAdjustments size={20} />
            Filtros
          </button>

          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Active filters */}
              {hasFilters && (
                <div>
                  <button onClick={clearFilters} className="text-sm text-red-400 hover:text-red-300 transition-colors">
                    Limpar filtros
                  </button>
                </div>
              )}

              {/* Brands */}
              <div className="card p-6">
                <h3 className="text-white font-heading font-semibold mb-4">Marcas</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setFilter('brand', '')}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      !currentBrand ? 'bg-primary-500/10 text-primary-400' : 'text-gray-400 hover:text-white hover:bg-dark-700'
                    }`}
                  >
                    Todas
                  </button>
                  {brands.map(brand => (
                    <button
                      key={brand}
                      onClick={() => setFilter('brand', brand)}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        currentBrand === brand ? 'bg-primary-500/10 text-primary-400' : 'text-gray-400 hover:text-white hover:bg-dark-700'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="card p-6">
                <h3 className="text-white font-heading font-semibold mb-4">Categorias</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setFilter('category', '')}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      !currentCategory ? 'bg-primary-500/10 text-primary-400' : 'text-gray-400 hover:text-white hover:bg-dark-700'
                    }`}
                  >
                    Todas
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFilter('category', cat)}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        currentCategory === cat ? 'bg-primary-500/10 text-primary-400' : 'text-gray-400 hover:text-white hover:bg-dark-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Filter Overlay */}
          {filterOpen && (
            <div className="fixed inset-0 z-40 lg:hidden">
              <div className="absolute inset-0 bg-black/60" onClick={() => setFilterOpen(false)} />
              <div className="absolute right-0 top-0 bottom-0 w-72 bg-dark-800 border-l border-dark-700 p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white font-heading font-semibold">Filtros</h3>
                  <button onClick={() => setFilterOpen(false)} className="text-gray-400 hover:text-white">
                    <HiX size={20} />
                  </button>
                </div>
                {hasFilters && (
                  <button onClick={clearFilters} className="text-sm text-red-400 mb-4 block">
                    Limpar filtros
                  </button>
                )}
                {/* Brands */}
                <div className="mb-6">
                  <h4 className="text-white font-heading font-semibold mb-3 text-sm">Marcas</h4>
                  <div className="space-y-1">
                    {brands.map(brand => (
                      <button
                        key={brand}
                        onClick={() => { setFilter('brand', brand); setFilterOpen(false); }}
                        className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                          currentBrand === brand ? 'bg-primary-500/10 text-primary-400' : 'text-gray-400'
                        }`}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Categories */}
                <div>
                  <h4 className="text-white font-heading font-semibold mb-3 text-sm">Categorias</h4>
                  <div className="space-y-1">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => { setFilter('category', cat); setFilterOpen(false); }}
                        className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                          currentCategory === cat ? 'bg-primary-500/10 text-primary-400' : 'text-gray-400'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="card p-6 animate-pulse">
                    <div className="aspect-square bg-dark-700 rounded-2xl mb-4" />
                    <div className="h-4 bg-dark-700 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-dark-700 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">😕</div>
                <h3 className="text-2xl font-heading font-bold text-white mb-2">Nenhum produto encontrado</h3>
                <p className="text-gray-400 mb-6">Tente buscar com outros termos ou limpar os filtros</p>
                <button onClick={clearFilters} className="btn-primary">
                  Limpar Filtros
                </button>
              </div>
            ) : (
              <motion.div
                initial="initial"
                animate="animate"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link to={`/produto/${product.id}`} className="card-hover block group">
                      <div className="relative aspect-square bg-gradient-to-br from-dark-700 to-dark-800 rounded-2xl overflow-hidden mb-4">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl">
                            📦
                          </div>
                        )}
                        {product.badge && (
                          <span className={`absolute top-3 right-3 ${
                            product.badge === 'LANÇAMENTO' ? 'badge-new' :
                            product.badge === 'PRÉ-VENDA' ? 'badge-pre' :
                            product.badge === 'KIT' ? 'badge-kit' : 'badge-promo'
                          }`}>
                            {product.badge}
                          </span>
                        )}
                        {product.originalPrice && (
                          <span className="absolute top-3 left-3 bg-red-500/90 text-white text-xs font-bold px-2 py-1 rounded-full">
                            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                          </span>
                        )}
                      </div>
                      <h3 className="text-white font-heading font-semibold group-hover:text-primary-400 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-gray-500 text-sm mt-1">
                        {product.puffs ? `${product.puffs.toLocaleString()} Puffs` : product.battery || product.category}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-primary-400 font-heading font-bold text-lg">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-gray-600 text-sm line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      {product.installments && (
                        <p className="text-gray-500 text-xs mt-1">
                          ou {product.installments.times}x de {formatPrice(product.installments.value)}
                        </p>
                      )}
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}