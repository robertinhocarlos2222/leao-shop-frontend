import { Link } from 'react-router-dom';
import { FaInstagram, FaWhatsapp, FaTiktok } from 'react-icons/fa';
import { HiMail, HiPhone } from 'react-icons/hi';

export default function Footer() {
  return (
    <footer className="bg-dark-950 border-t border-dark-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🦁</span>
              <div>
                <h3 className="text-xl font-heading font-bold gradient-text">Leão Shop</h3>
                <p className="text-[10px] text-gray-500 -mt-1 tracking-widest uppercase">Pods & Vapes</p>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Sua loja especializada em pods e vapes descartáveis. Os melhores preços, marcas e sabores do Brasil.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-3 bg-dark-800 rounded-lg text-gray-400 hover:text-primary-400 hover:border-primary-500/30 border border-dark-700 transition-all duration-300">
                <FaInstagram size={18} />
              </a>
              <a href="#" className="p-3 bg-dark-800 rounded-lg text-gray-400 hover:text-primary-400 hover:border-primary-500/30 border border-dark-700 transition-all duration-300">
                <FaWhatsapp size={18} />
              </a>
              <a href="#" className="p-3 bg-dark-800 rounded-lg text-gray-400 hover:text-primary-400 hover:border-primary-500/30 border border-dark-700 transition-all duration-300">
                <FaTiktok size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-heading font-semibold mb-6">Links Rápidos</h4>
            <ul className="space-y-3">
              {[
                { name: 'Início', path: '/' },
                { name: 'Todos os Produtos', path: '/produtos' },
                { name: 'Kits Promocionais', path: '/produtos?category=Kits+Promocionais' },
                { name: 'Acessórios', path: '/produtos?category=Acess%C3%B3rios' },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Brands */}
          <div>
            <h4 className="text-white font-heading font-semibold mb-6">Marcas</h4>
            <ul className="space-y-3">
              {['Ignite', 'Elfbar', 'Oxbar'].map((brand) => (
                <li key={brand}>
                  <Link to={`/produtos?brand=${brand}`} className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
                    {brand}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-heading font-semibold mb-6">Contato</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <HiMail className="text-primary-500 shrink-0" size={18} />
                <span>contato@leaoshop.com.br</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <HiPhone className="text-primary-500 shrink-0" size={18} />
                <span>(11) 99999-9999</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <FaWhatsapp className="text-primary-500 shrink-0" size={18} />
                <span>WhatsApp: (11) 99999-9999</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-dark-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 Leão Shop. Todos os direitos reservados.
          </p>
          <Link to="/admin/login" className="text-xs text-transparent hover:text-transparent">
            .
          </Link>
          <div className="flex gap-4 text-xs text-gray-600">
            <span>Produtos originais</span>
            <span>•</span>
            <span>Entrega rápida</span>
            <span>•</span>
            <span>Pagamento seguro</span>
          </div>
        </div>
      </div>
    </footer>
  );
}