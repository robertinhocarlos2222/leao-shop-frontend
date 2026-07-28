import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowRight, HiLightningBolt, HiShieldCheck, HiTruck, HiCreditCard } from 'react-icons/hi';
import { getProducts } from '../services/api';

function formatPrice(cents) {
  return `R$ ${(cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const fadeInUp = {
  initial: { y: 40, opacity: 0 },
  animate: { y: 0, opacity: 1 },
};

const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.1 }
  }
};

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const data = await getProducts({ featured: 'true', limit: 8 });
      setFeaturedProducts(data.data || []);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  }

  const categories = [
    { name: 'Ignite', icon: '🔥', count: '6 Pods', color: 'from-red-600 to-red-400', slug: 'Ignite' },
    { name: 'Elfbar', icon: '⭐', count: '5 Pods', color: 'from-purple-600 to-purple-400', slug: 'Elfbar' },
    { name: 'Oxbar', icon: '✨', count: '3 Pods', color: 'from-blue-600 to-blue-400', slug: 'Oxbar' },
    { name: 'Kits', icon: '🎁', count: '9 Kits', color: 'from-green-600 to-green-400', slug: 'Kits Promocionais' },
  ];

  const benefits = [
    { icon: HiShieldCheck, title: 'Produtos Originais', desc: 'Garantia de autenticidade' },
    { icon: HiTruck, title: 'Entrega Rápida', desc: 'Em todo o Brasil' },
    { icon: HiCreditCard, title: 'Parcele em até 12x', desc: 'No cartão de crédito' },
    { icon: HiLightningBolt, title: 'PIX Aprovado na Hora', desc: 'Pagamento instantâneo' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-900/95 to-dark-900" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-600/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="text-center lg:text-left"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                <span className="text-primary-400 text-sm font-medium">NOVOS PRODUTOS CHEGANDO</span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-8xl font-heading font-black leading-tight mb-6">
                <span className="text-white">Sinta o </span>
                <span className="gradient-text">Sabor</span>
                <br />
                <span className="text-white">da </span>
                <span className="gradient-text">Nuvem</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="text-gray-400 text-lg md:text-xl max-w-lg mx-auto lg:mx-0 mb-8">
                Os melhores pods e vapes descartáveis do Brasil. Ignite, Elfbar, Oxbar e muito mais com os preços mais baixos.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/produtos" className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center gap-2 group">
                  Ver Produtos
                  <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/produtos?brand=Ignite" className="btn-secondary text-lg px-8 py-4 inline-flex items-center justify-center">
                  Ignite Collection
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div variants={fadeInUp} className="flex gap-8 mt-12 justify-center lg:justify-start">
                <div>
                  <p className="text-3xl font-heading font-bold gradient-text">48+</p>
                  <p className="text-gray-500 text-sm">Produtos</p>
                </div>
                <div className="w-px bg-dark-700" />
                <div>
                  <p className="text-3xl font-heading font-bold gradient-text">8</p>
                  <p className="text-gray-500 text-sm">Marcas</p>
                </div>
                <div className="w-px bg-dark-700" />
                <div>
                  <p className="text-3xl font-heading font-bold gradient-text">100%</p>
                  <p className="text-gray-500 text-sm">Original</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right - Floating Products */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:flex items-center justify-center relative"
            >
              <div className="relative w-96 h-96">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-primary-600/10 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="text-9xl mb-4 animate-float">🦁</div>
                  <p className="text-primary-400 font-heading font-bold text-2xl">Leão Shop</p>
                  <p className="text-gray-500 text-sm">Desde 2026</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 -mt-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {benefits.map((benefit) => (
              <motion.div
                key={benefit.title}
                variants={fadeInUp}
                className="card p-6 text-center"
              >
                <benefit.icon className="text-primary-500 text-3xl mx-auto mb-3" />
                <h3 className="text-white font-heading font-semibold text-sm">{benefit.title}</h3>
                <p className="text-gray-500 text-xs mt-1">{benefit.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeInUp} className="section-title">
              Navegue por <span className="gradient-text">Marcas</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="section-subtitle">
              Encontre sua marca favorita
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat, index) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/produtos?brand=${cat.slug}`}
                  className="card-hover block p-8 text-center group"
                >
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                    {cat.icon}
                  </div>
                  <h3 className="text-white font-heading font-bold text-lg">{cat.name}</h3>
                  <p className="text-gray-500 text-sm mt-1">{cat.count}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-dark-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="flex flex-col md:flex-row items-center justify-between mb-12"
          >
            <div>
              <motion.h2 variants={fadeInUp} className="section-title">
                Produtos em <span className="gradient-text">Destaque</span>
              </motion.h2>
              <motion.p variants={fadeInUp} className="section-subtitle">
                Os mais vendidos da semana
              </motion.p>
            </div>
            <motion.div variants={fadeInUp}>
              <Link to="/produtos" className="btn-secondary inline-flex items-center gap-2 group">
                Ver Todos
                <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="card p-6 animate-pulse">
                  <div className="aspect-square bg-dark-700 rounded-2xl mb-4" />
                  <div className="h-4 bg-dark-700 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-dark-700 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {featuredProducts.slice(0, 8).map((product) => (
                <motion.div key={product.id} variants={fadeInUp}>
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
                      {product.puffs ? `${product.puffs.toLocaleString()} Puffs` : product.battery}
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
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card p-12 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 via-primary-500/5 to-primary-600/10" />
            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-6">
                Quer o <span className="gradient-text">Melhor Preço</span>?
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                Assine nossa newsletter e receba ofertas exclusivas, lançamentos e cupons de desconto direto no seu WhatsApp!
              </p>
              <Link to="/produtos" className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2 group">
                Comprar Agora
                <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}