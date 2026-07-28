import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiCheck, HiArrowRight, HiShoppingBag } from 'react-icons/hi';

export default function Success() {
  const [searchParams] = useSearchParams();
  const transactionId = searchParams.get('transaction');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24 pb-20 min-h-screen flex items-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="card p-8 md:p-12 text-center"
        >
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center"
          >
            <HiCheck className="text-white text-5xl" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
              Pedido Confirmado! 🎉
            </h1>
            <p className="text-gray-400 text-lg mb-8">
              Seu pedido foi recebido com sucesso. Em breve você receberá um email com os detalhes da compra.
            </p>
          </motion.div>

          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-dark-900 rounded-2xl p-6 mb-8 border border-dark-700"
          >
            <div className="flex items-center gap-3 mb-4">
              <HiShoppingBag className="text-primary-500 text-xl" />
              <h2 className="text-white font-heading font-semibold">Detalhes do Pedido</h2>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Status</span>
                <span className="text-green-400 font-medium flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Confirmado
                </span>
              </div>
              {transactionId && (
                <div className="flex justify-between">
                  <span className="text-gray-400">ID da Transação</span>
                  <span className="text-gray-300 font-mono text-xs">{transactionId}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-400">Pagamento</span>
                <span className="text-white">PIX / Cartão / Boleto</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Previsão de Entrega</span>
                <span className="text-white">5-10 dias úteis</span>
              </div>
            </div>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-4"
          >
            <p className="text-gray-500 text-sm">
              Fique de olho no seu email para atualizações do pedido.
              Qualquer dúvida, entre em contato conosco.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Link
                to="/"
                className="btn-secondary inline-flex items-center justify-center gap-2"
              >
                Voltar ao Início
              </Link>
              <Link
                to="/produtos"
                className="btn-primary inline-flex items-center justify-center gap-2 group"
              >
                Continuar Comprando
                <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}