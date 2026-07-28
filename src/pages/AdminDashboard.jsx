import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiCube, HiCurrencyDollar, HiTrendingUp, HiPlus } from 'react-icons/hi';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const token = localStorage.getItem('adminToken');
      
      // Carrega estatísticas
      const statsResponse = await fetch('https://leao-shop-backend.onrender.com/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const statsData = await statsResponse.json();
      if (statsData.success) setStats(statsData.data);

      // Carrega produtos
      const productsResponse = await fetch('https://leao-shop-backend.onrender.com/api/admin/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const productsData = await productsResponse.json();
      if (productsData.success) setProducts(productsData.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  }

  if (loading) {
    return (
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-heading font-bold text-white mb-2">
              Painel <span className="gradient-text">Admin</span>
            </h1>
            <p className="text-gray-400">Gerencie sua loja</p>
          </div>
          <button
            onClick={handleLogout}
            className="btn-secondary"
          >
            Sair
          </button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <HiCube className="text-3xl text-primary-400" />
              </div>
              <p className="text-gray-400 text-sm mb-1">Total de Produtos</p>
              <p className="text-3xl font-heading font-bold text-white">{stats.totalProducts}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <HiTrendingUp className="text-3xl text-green-400" />
              </div>
              <p className="text-gray-400 text-sm mb-1">Produtos Ativos</p>
              <p className="text-3xl font-heading font-bold text-white">{stats.activeProducts}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <HiTrendingUp className="text-3xl text-red-400" />
              </div>
              <p className="text-gray-400 text-sm mb-1">Produtos Inativos</p>
              <p className="text-3xl font-heading font-bold text-white">{stats.inactiveProducts}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <HiCurrencyDollar className="text-3xl text-yellow-400" />
              </div>
              <p className="text-gray-400 text-sm mb-1">Valor Total</p>
              <p className="text-3xl font-heading font-bold text-white">
                R$ {(stats.totalValue / 100).toFixed(2)}
              </p>
            </motion.div>
          </div>
        )}

        {/* Products List */}
        <div className="card p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-heading font-bold text-white">
              Produtos
            </h2>
            <button
              onClick={() => navigate('/admin/products/new')}
              className="btn-primary inline-flex items-center gap-2"
            >
              <HiPlus /> Novo Produto
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-700">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">ID</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Nome</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Preço</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Categoria</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-dark-700 hover:bg-dark-800/50"
                  >
                    <td className="py-4 px-4 text-gray-300 text-sm">{product.id}</td>
                    <td className="py-4 px-4 text-white">{product.name}</td>
                    <td className="py-4 px-4 text-primary-400 font-medium">
                      R$ {(product.price / 100).toFixed(2)}
                    </td>
                    <td className="py-4 px-4 text-gray-400">{product.category}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        product.active
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}>
                        {product.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => navigate(`/admin/products/${product.id}`)}
                        className="text-primary-400 hover:text-primary-300 text-sm"
                      >
                        Editar
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}