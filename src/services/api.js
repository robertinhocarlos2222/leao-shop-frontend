import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_URL ? `${API_URL}/api` : '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 5000,
});

// ===================== DADOS DOS PRODUTOS =====================
const productsData = [
  { id: 1, name: "IGNITE V15", brand: "Ignite", category: "Pods Descartáveis", puffs: 1500, price: 4290, originalPrice: 5490, installments: { times: 2, value: 2145 }, flavors: ["Menta", "Frutas Vermelhas", "Melancia", "Uva", "Morango"], image: "/images/ignite-v15.jpg", badge: null, featured: false },
  { id: 2, name: "IGNITE V50", brand: "Ignite", category: "Pods Descartáveis", puffs: 5000, battery: "650 mAh", price: 7999, originalPrice: 9490, installments: { times: 4, value: 1999 }, flavors: ["Menta", "Frutas Vermelhas", "Melancia", "Uva", "Morango", "Pêssego", "Manga"], image: "/images/ignite-v50.webp", badge: null, featured: true },
  { id: 3, name: "IGNITE V80", brand: "Ignite", category: "Pods Descartáveis", puffs: 8000, price: 9690, originalPrice: 11690, installments: { times: 4, value: 2423 }, flavors: ["Menta", "Blueberry", "Melancia", "Pêssego", "Manga", "Cereja"], image: "/images/ignite-v80.jpg", badge: null, featured: false },
  { id: 4, name: "IGNITE V150", brand: "Ignite", category: "Pods Descartáveis", puffs: 15000, price: 10990, originalPrice: 13490, installments: { times: 5, value: 2198 }, flavors: ["Menta", "Frutas Tropicais", "Melancia", "Uva", "Morango", "Manga", "Blueberry"], image: "/images/ignite-v150.jpg", badge: null, featured: true },
  { id: 5, name: "IGNITE V250", brand: "Ignite", category: "Pods Descartáveis", puffs: 25000, price: 12990, originalPrice: 17990, installments: { times: 6, value: 2165 }, flavors: ["Menta", "Frutas Vermelhas", "Melancia", "Uva", "Morango", "Manga", "Cereja", "Pêssego"], image: "/images/ignite-v250.jpg", badge: null, featured: false },
  { id: 6, name: "IGNITE V300 MAX", brand: "Ignite", category: "Pods Descartáveis", puffs: 30000, battery: "Display Digital", price: 15990, originalPrice: 19990, installments: { times: 7, value: 2284 }, flavors: ["Menta Ice", "Frutas Vermelhas", "Melancia", "Uva", "Manga", "Pêssego"], image: "/images/ignite-v300-max.webp", badge: "LANÇAMENTO", featured: true },
  { id: 7, name: "Elf Bar BC10000", brand: "Elfbar", category: "Pods Descartáveis", puffs: 10000, price: 9990, originalPrice: 11690, installments: { times: 4, value: 2498 }, flavors: ["Menta", "Blueberry", "Melancia", "Pêssego", "Morango"], image: "/images/elf-bar-bc10000.webp", badge: null, featured: false },
  { id: 8, name: "ELFBAR TE30k", brand: "Elfbar", category: "Pods Descartáveis", puffs: 30000, battery: "700 mAh", price: 11990, originalPrice: 12490, installments: { times: 5, value: 2398 }, flavors: ["Menta", "Frutas Tropicais", "Melancia", "Uva", "Morango", "Manga"], image: "/images/elfbar-te30k.webp", badge: null, featured: true },
  { id: 9, name: "ELFBAR Ice King 40k", brand: "Elfbar", category: "Pods Descartáveis", puffs: 40000, battery: "850 mAh", price: 13690, originalPrice: 15990, installments: { times: 6, value: 2282 }, flavors: ["Menta Ice", "Frutas Vermelhas Ice", "Melancia Ice", "Uva Ice", "Morango Ice"], image: "/images/elfbar-ice-king-40k.webp", badge: null, featured: false },
  { id: 10, name: "ELFBAR Dual 20k", brand: "Elfbar", category: "Pods Descartáveis", puffs: 20000, battery: "Dual Sabor", price: 10990, originalPrice: 12990, installments: { times: 5, value: 2198 }, flavors: ["Menta+Melancia", "Morango+Pêssego", "Uva+Blueberry"], image: "/images/elfbar-dual-20k.webp", badge: null, featured: false },
  { id: 11, name: "ELFBAR Ice King 50k", brand: "Elfbar", category: "Pods Descartáveis", puffs: 50000, battery: "1000 mAh", price: 15990, originalPrice: 18990, installments: { times: 7, value: 2284 }, flavors: ["Menta Ice", "Melancia Ice", "Frutas Tropicais Ice"], image: "/images/elfbar-ice-king-50k.webp", badge: "PRÉ-VENDA", featured: true },
  { id: 12, name: "Oxbar Magic Maze 2", brand: "Oxbar", category: "Pods Descartáveis", puffs: 30000, price: 12990, originalPrice: 14990, installments: { times: 6, value: 2165 }, flavors: ["Menta", "Melancia", "Pêssego", "Manga", "Blueberry"], image: "/images/oxbar-magic-maze-2.webp", badge: null, featured: false },
  { id: 13, name: "Oxbar Magic Maze Pro", brand: "Oxbar", category: "Pods Descartáveis", puffs: 40000, battery: "Display LED", price: 14990, originalPrice: 17990, installments: { times: 6, value: 2498 }, flavors: ["Menta Ice", "Frutas Tropicais", "Melancia", "Uva", "Manga"], image: "/images/oxbar-magic-maze-pro.webp", badge: null, featured: true },
  { id: 14, name: "Oxbar Magic Maze 3", brand: "Oxbar", category: "Pods Descartáveis", puffs: 35000, battery: "3 Sabores", price: 15990, originalPrice: 18990, installments: { times: 7, value: 2284 }, flavors: ["Menta+Melancia+Pêssego", "Morango+Uva+Manga"], image: "/images/oxbar-magic-maze-3.webp", badge: "PRÉ-VENDA", featured: false },
  { id: 15, name: "Pod Extreme X5000", brand: "Outros", category: "Pods Descartáveis", puffs: 5000, price: 6990, originalPrice: 8990, installments: { times: 3, value: 2330 }, flavors: ["Menta", "Melancia", "Morango", "Uva"], image: "/images/pod-extreme-x5000.webp", badge: null, featured: false },
  { id: 16, name: "Turbo Pod Max 8000", brand: "Outros", category: "Pods Descartáveis", puffs: 8000, battery: "Turbo Airflow", price: 8990, originalPrice: 10990, installments: { times: 4, value: 2248 }, flavors: ["Menta", "Frutas Vermelhas", "Melancia", "Pêssego"], image: "/images/turbo-pod-max-8000.jpg", badge: null, featured: false },
  { id: 17, name: "Mega Vape Storm 12000", brand: "Outros", category: "Pods Descartáveis", puffs: 12000, battery: "USB-C", price: 10990, originalPrice: 13990, installments: { times: 5, value: 2198 }, flavors: ["Menta", "Melancia", "Uva", "Morango", "Manga"], image: "/images/mega-vape-storm-12000.jpg", badge: null, featured: false },
  { id: 18, name: "Ultra Pod Infinity 20000", brand: "Outros", category: "Pods Descartáveis", puffs: 20000, battery: "USB-C", price: 13990, originalPrice: 16990, installments: { times: 6, value: 2332 }, flavors: ["Menta", "Frutas Tropicais", "Melancia", "Blueberry"], image: "/images/ultra-pod-infinity-20000.jpg", badge: null, featured: false },
  { id: 19, name: "Pod Lite 3000 Puffs", brand: "Outros", category: "Pods Descartáveis", puffs: 3000, price: 4990, originalPrice: 6490, installments: { times: 2, value: 2495 }, flavors: ["Menta", "Melancia", "Morango", "Uva"], image: "/images/pod-lite-3000-puffs.jpg", badge: null, featured: false },
  { id: 20, name: "Pod Max 6000 Puffs", brand: "Outros", category: "Pods Descartáveis", puffs: 6000, battery: "Bobina Cerâmica", price: 7490, originalPrice: 9490, installments: { times: 3, value: 2497 }, flavors: ["Menta", "Frutas Vermelhas", "Melancia", "Pêssego"], image: "/images/pod-max-6000-puffs.jpg", badge: null, featured: false },
  { id: 21, name: "Pod Turbo Max 15000", brand: "Outros", category: "Pods Descartáveis", puffs: 15000, battery: "Turbo 2.0", price: 11990, originalPrice: 14990, installments: { times: 5, value: 2398 }, flavors: ["Menta", "Melancia", "Morango", "Manga"], image: "/images/pod-turbo-max-15000.jpg", badge: null, featured: false },
  { id: 22, name: "Vape Kit Iniciante V200", brand: "Outros", category: "Baterias & Refis", puffs: null, battery: "1200 mAh", price: 14990, originalPrice: 19990, installments: { times: 6, value: 2498 }, flavors: ["Menta", "Melancia", "Morango", "Tabaco"], image: "/images/vape-kit-iniciante-v200.webp", badge: "KIT COMPLETO", featured: false },
  { id: 23, name: "Bateria Power Pod 650 mAh", brand: "Outros", category: "Baterias & Refis", puffs: null, battery: "USB-C", price: 4990, originalPrice: 6990, installments: { times: 2, value: 2495 }, flavors: [], image: null, badge: null, featured: false },
  { id: 24, name: "Bateria Ultra Cell 1000 mAh", brand: "Outros", category: "Baterias & Refis", puffs: null, battery: "USB-C | Carregamento Rápido", price: 6990, originalPrice: 8990, installments: { times: 3, value: 2330 }, flavors: [], image: null, badge: null, featured: false },
  { id: 25, name: "Bateria Power Max 1500 mAh", brand: "Outros", category: "Baterias & Refis", puffs: null, battery: "LED Display | USB-C", price: 8990, originalPrice: 11990, installments: { times: 4, value: 2248 }, flavors: [], image: null, badge: null, featured: false },
  { id: 26, name: "Pod Refil Recarregável X-Pod", brand: "Outros", category: "Baterias & Refis", puffs: null, battery: "2ml | Pacote com 3", price: 2990, originalPrice: 3990, installments: { times: 1, value: 2990 }, flavors: ["Menta", "Melancia", "Morango", "Uva", "Tabaco"], image: null, badge: null, featured: false },
  { id: 27, name: "Juice E-Liquid Premium 30ml", brand: "Outros", category: "Baterias & Refis", puffs: null, battery: "50mg Nicotina", price: 3990, originalPrice: 5490, installments: { times: 2, value: 1995 }, flavors: ["Menta", "Frutas Vermelhas", "Melancia", "Uva", "Morango", "Manga"], image: null, badge: null, featured: false },
  { id: 28, name: "Juice E-Liquid Ice 30ml", brand: "Outros", category: "Baterias & Refis", puffs: null, battery: "50mg Nicotina | Ice", price: 4490, originalPrice: 5990, installments: { times: 2, value: 2245 }, flavors: ["Menta Ice", "Melancia Ice", "Uva Ice", "Morango Ice"], image: null, badge: null, featured: false },
  { id: 29, name: "Juice Premium Blueberry Ice 30ml", brand: "Outros", category: "Juices Especiais", puffs: null, battery: "50mg | Blueberry Ice", price: 4490, originalPrice: 5990, installments: { times: 2, value: 2245 }, flavors: [], image: null, badge: null, featured: false },
  { id: 30, name: "Juice Premium Tutti Frutti 30ml", brand: "Outros", category: "Juices Especiais", puffs: null, battery: "50mg | Tutti Frutti", price: 3990, originalPrice: 5490, installments: { times: 2, value: 1995 }, flavors: [], image: null, badge: null, featured: false },
  { id: 31, name: "Juice Premium Manga Ice 30ml", brand: "Outros", category: "Juices Especiais", puffs: null, battery: "50mg | Manga Ice", price: 4490, originalPrice: 5990, installments: { times: 2, value: 2245 }, flavors: [], image: null, badge: null, featured: false },
  { id: 32, name: "Juice Premium Morango Ice 30ml", brand: "Outros", category: "Juices Especiais", puffs: null, battery: "50mg | Morango Ice", price: 4490, originalPrice: 5990, installments: { times: 2, value: 2245 }, flavors: [], image: null, badge: null, featured: false },
  { id: 33, name: "Cabo USB-C para Vape", brand: "Outros", category: "Acessórios", puffs: null, battery: "1.5m | Fast Charge", price: 1990, originalPrice: 2990, installments: { times: 1, value: 1990 }, flavors: [], image: null, badge: null, featured: false },
  { id: 34, name: "Estojo Protetor Universal", brand: "Outros", category: "Acessórios", puffs: null, battery: "Silicone", price: 3490, originalPrice: 4990, installments: { times: 1, value: 3490 }, flavors: [], image: null, badge: null, featured: false },
  { id: 35, name: "Carregador Duplo USB-C", brand: "Outros", category: "Acessórios", puffs: null, battery: "Duas Saídas | 2.4A", price: 4990, originalPrice: 6990, installments: { times: 2, value: 2495 }, flavors: [], image: null, badge: null, featured: false },
  { id: 36, name: "Alça de Pescoço para Pod", brand: "Outros", category: "Acessórios", puffs: null, battery: "Ajustável | Universal", price: 1490, originalPrice: 1990, installments: { times: 1, value: 1490 }, flavors: [], image: null, badge: null, featured: false },
  { id: 37, name: "Kit Limpeza Vape Pro", brand: "Outros", category: "Acessórios", puffs: null, battery: "6 Peças", price: 2990, originalPrice: 4490, installments: { times: 1, value: 2990 }, flavors: [], image: null, badge: null, featured: false },
  { id: 38, name: "Ponteira Silicone Universal", brand: "Outros", category: "Acessórios", puffs: null, battery: "Silicone", price: 990, originalPrice: 1490, installments: { times: 1, value: 990 }, flavors: [], image: null, badge: null, featured: false },
  { id: 39, name: "Adaptador USB-C Magnético", brand: "Outros", category: "Acessórios", puffs: null, battery: "Magnético | Universal", price: 2490, originalPrice: 3490, installments: { times: 1, value: 2490 }, flavors: [], image: null, badge: null, featured: false },
  { id: 40, name: "Kit Duo IGNITE V50 + V150", brand: "Ignite", category: "Kits Promocionais", puffs: null, battery: "2 Unidades", price: 16990, originalPrice: null, installments: { times: 7, value: 2427 }, flavors: ["Menta+Frutas Vermelhas", "Melancia+Uva", "Morango+Manga"], image: null, badge: "KIT", featured: true },
  { id: 41, name: "Kit Triplo IGNITE V80 + V150 + V250", brand: "Ignite", category: "Kits Promocionais", puffs: null, battery: "3 Unidades", price: 29990, originalPrice: null, installments: { times: 12, value: 2499 }, flavors: ["Menta+Melancia+Pêssego", "Frutas Vermelhas+Uva+Manga"], image: null, badge: "KIT", featured: false },
  { id: 42, name: "Kit Iniciante Vape + E-Liquid", brand: "Outros", category: "Kits Promocionais", puffs: null, battery: "Vape + Juice 30ml", price: 7990, originalPrice: null, installments: { times: 4, value: 1998 }, flavors: [], image: null, badge: "KIT", featured: false },
  { id: 43, name: "Kit Festival ELFBAR TE30k + Ice King 40k", brand: "Elfbar", category: "Kits Promocionais", puffs: null, battery: "2 Unidades Premium", price: 23990, originalPrice: null, installments: { times: 10, value: 2399 }, flavors: [], image: null, badge: "KIT", featured: true },
  { id: 44, name: "Kit Família IGNITE (V15 + V50 + V80)", brand: "Ignite", category: "Kits Promocionais", puffs: null, battery: "3 Unidades", price: 19990, originalPrice: null, installments: { times: 8, value: 2499 }, flavors: [], image: null, badge: "KIT", featured: false },
  { id: 45, name: "Pack 3 Sabores IGNITE V50", brand: "Ignite", category: "Kits Promocionais", puffs: null, battery: "3 V50 - Sabores Diferentes", price: 21990, originalPrice: null, installments: { times: 9, value: 2443 }, flavors: [], image: null, badge: "KIT", featured: false },
  { id: 46, name: "Pack 5 E-Liquids 30ml", brand: "Outros", category: "Kits Promocionais", puffs: null, battery: "5 Juices - Sabores Variados", price: 17990, originalPrice: null, installments: { times: 7, value: 2570 }, flavors: [], image: null, badge: "KIT", featured: false },
  { id: 47, name: "Pack 2 ELFBAR TE30k + Ice King", brand: "Elfbar", category: "Kits Promocionais", puffs: null, battery: "2 Unidades Premium", price: 23990, originalPrice: null, installments: { times: 10, value: 2399 }, flavors: [], image: null, badge: "KIT", featured: false },
  { id: 48, name: "Kit Econômico 2 Pods Lite 3000", brand: "Outros", category: "Kits Promocionais", puffs: null, battery: "2 Pods Lite 3000", price: 8990, originalPrice: null, installments: { times: 4, value: 2248 }, flavors: [], image: null, badge: "KIT", featured: false }
];

// ===================== FUNÇÕES =====================

// Produtos (com fallback offline)
export const getProducts = async (params = {}) => {
  try {
    const { data } = await api.get('/products', { params });
    return data;
  } catch {
    let filtered = [...productsData];
    const { category, brand, search, featured } = params;
    if (category) filtered = filtered.filter(p => p.category === category);
    if (brand) filtered = filtered.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(term) || p.flavors.some(f => f.toLowerCase().includes(term)));
    }
    if (featured === 'true') filtered = filtered.filter(p => p.featured);
    return { total: filtered.length, data: filtered };
  }
};

export const getProduct = async (id) => {
  try {
    const { data } = await api.get(`/products/${id}`);
    return data;
  } catch {
    const product = productsData.find(p => p.id === id);
    if (!product) throw new Error('Produto não encontrado');
    return product;
  }
};

// Checkout (com fallback SIMULADO para testar)
export const createCheckout = async (checkoutData) => {
  try {
    const { data } = await api.post('/checkout', checkoutData);
    return data;
  } catch {
    // Simula um checkout bem-sucedido (modo offline/demonstração)
    const totalAmount = checkoutData.items.reduce((sum, item) => {
      const product = productsData.find(p => p.id === item.id);
      return sum + (product ? product.price * (item.quantity || 1) : 0);
    }, 0);

    const method = checkoutData.method || 'pix';
    const transactionId = 'txn_sim_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

    // Gera um QR Code fake (imagem placeholder)
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${transactionId}`;

    const simulatedResponse = {
      success: true,
      transaction: {
        id: transactionId,
        method: method,
        status: method === 'pix' ? 'pendente' : 'pago',
        amount: totalAmount,
        qrCode: `00020126580014BR.GOV.BCB.PIX0136${transactionId}5204000053039865406${totalAmount}5802BR5913LeaoShop6008BRASILIA62070503***6304ABCD`,
        qrCodeUrl: qrCodeUrl,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        customer: checkoutData.customer
      },
      order: {
        items: checkoutData.items,
        total: totalAmount,
        customer: checkoutData.customer
      }
    };

    // Aguarda um pouco para simular processamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    return simulatedResponse;
  }
};

export const getCategories = async () => {
  try {
    const { data } = await api.get('/products/categories');
    return data;
  } catch {
    const categories = [...new Set(productsData.map(p => p.category))];
    return { data: categories };
  }
};

export default api;