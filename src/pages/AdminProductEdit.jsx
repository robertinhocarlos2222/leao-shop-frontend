import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiSave, HiTrash, HiUpload, HiPhotograph } from 'react-icons/hi';

export default function AdminProductEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNew = id === 'new';
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    category: 'Geral',
    active: true,
    description: '',
    puffs: '',
    battery: '',
    badge: '',
    originalPrice: '',
    installments: null,
    featured: false,
    flavors: []
  });
  
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [productId, setProductId] = useState(id);

  useEffect(() => {
    if (!isNew) {
      setProductId(id);
      loadProduct();
    }
  }, [id]);

  async function loadProduct() {
    try {
      const token = localStorage.getItem('adminToken');
      const productIdToLoad = productId || id;
      
      console.log('Carregando produto ID:', productIdToLoad);
      
      // Adiciona timestamp para evitar cache
      const timestamp = Date.now();
      const response = await fetch(`https://leao-shop-backend.onrender.com/api/admin/products/${productIdToLoad}?_t=${timestamp}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      console.log('Dados recebidos:', data);
      
      if (data.success) {
        const productData = {
          name: data.data.name || '',
          price: data.data.price || '',
          image: data.data.image || '',
          category: data.data.category || 'Geral',
          active: data.data.active !== undefined ? data.data.active : true,
          description: data.data.description || '',
          puffs: data.data.puffs || '',
          battery: data.data.battery || '',
          badge: data.data.badge || '',
          originalPrice: data.data.originalPrice || '',
          installments: data.data.installments || null,
          featured: data.data.featured || false,
          flavors: data.data.flavors || []
        };
        
        console.log('Atualizando formulário com:', productData);
        
        setFormData(productData);
        setImagePreview(data.data.image || '');
      } else {
        console.error('Erro ao carregar:', data.error);
        alert('Erro ao carregar produto: ' + data.error);
      }
    } catch (error) {
      console.error('Erro ao carregar produto:', error);
      alert('Erro ao carregar produto');
    } finally {
      setLoading(false);
    }
  }

  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Validações
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (file.size > maxSize) {
      alert('Imagem muito grande! Máximo 5MB');
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      alert('Formato inválido! Use JPG, PNG ou WebP');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result;
      setFormData(prev => ({ ...prev, image: base64 }));
      setImagePreview(base64);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('adminToken');
      
      const productData = {
        ...formData,
        price: parseInt(formData.price),
        originalPrice: formData.originalPrice ? parseInt(formData.originalPrice) : null,
        puffs: formData.puffs ? parseInt(formData.puffs) : null
      };

      const productIdToUse = isNew ? null : (productId || id);
      const url = isNew 
        ? 'https://leao-shop-backend.onrender.com/api/admin/products'
        : `https://leao-shop-backend.onrender.com/api/admin/products/${productIdToUse}`;
      
      const method = isNew ? 'POST' : 'PUT';

      console.log('Salvando produto:', productData);

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });

      const data = await response.json();
      console.log('Resposta:', data);

      if (data.success) {
        // Recarrega os dados do produto após salvar
        await loadProduct();
        alert('Produto salvo com sucesso!');
      } else {
        alert('Erro ao salvar: ' + data.error);
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar produto');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Tem certeza que deseja deletar este produto?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const productIdToDelete = productId || id;
      
      const response = await fetch(`https://leao-shop-backend.onrender.com/api/admin/products/${productIdToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        alert('Produto deletado com sucesso!');
        navigate('/admin/dashboard');
      } else {
        alert('Erro ao deletar: ' + data.error);
      }
    } catch (error) {
      alert('Erro ao deletar produto');
    }
  }

  if (loading) {
    return (
      <div className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-primary-400 transition-colors"
          >
            <HiArrowLeft /> Voltar
          </button>
          {!isNew && (
            <button
              onClick={handleDelete}
              className="btn-secondary inline-flex items-center gap-2 text-red-400 hover:text-red-300"
            >
              <HiTrash /> Deletar
            </button>
          )}
        </div>

        <div className="card p-8">
          <h1 className="text-3xl font-heading font-bold text-white mb-8">
            {isNew ? 'Novo Produto' : 'Editar Produto'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-2">Nome do Produto *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="input-field"
                  placeholder="Ex: Elf Bar BC10000"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Preço (em centavos) *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  required
                  className="input-field"
                  placeholder="9990"
                />
                <p className="text-xs text-gray-500 mt-1">Ex: 9990 = R$ 99,90</p>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Preço Original (opcional)</label>
                <input
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
                  className="input-field"
                  placeholder="12990"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-2">Imagem do Produto *</label>
                
                {/* Upload de imagem */}
                <div className="mb-4">
                  <label className="flex items-center justify-center gap-2 p-6 border-2 border-dashed border-dark-600 rounded-xl cursor-pointer hover:border-primary-500 transition-colors">
                    <HiUpload className="text-2xl text-gray-400" />
                    <span className="text-gray-400">Clique para enviar imagem</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">Formatos: JPG, PNG, WebP (máx. 5MB)</p>
                </div>

                {/* Preview da imagem */}
                {imagePreview && (
                  <div className="mb-4 p-4 bg-dark-800 rounded-xl">
                    <p className="text-xs text-gray-400 mb-2">Preview:</p>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-contain bg-white rounded-lg"
                    />
                  </div>
                )}

                {/* URL manual */}
                <label className="block text-sm text-gray-400 mb-2">Ou cole a URL da imagem:</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, image: e.target.value }));
                    setImagePreview(e.target.value);
                  }}
                  required
                  className="input-field"
                  placeholder="https://exemplo.com/imagem.png"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Categoria *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="input-field"
                >
                  <option value="Geral">Geral</option>
                  <option value="Ignite">Ignite</option>
                  <option value="Elfbar">Elfbar</option>
                  <option value="Oxbar">Oxbar</option>
                  <option value="Kits Promocionais">Kits Promocionais</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Badge (opcional)</label>
                <select
                  value={formData.badge}
                  onChange={(e) => setFormData(prev => ({ ...prev, badge: e.target.value }))}
                  className="input-field"
                >
                  <option value="">Nenhum</option>
                  <option value="LANÇAMENTO">LANÇAMENTO</option>
                  <option value="PRÉ-VENDA">PRÉ-VENDA</option>
                  <option value="KIT">KIT</option>
                  <option value="PROMOÇÃO">PROMOÇÃO</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Puffs (opcional)</label>
                <input
                  type="number"
                  value={formData.puffs}
                  onChange={(e) => setFormData(prev => ({ ...prev, puffs: e.target.value }))}
                  className="input-field"
                  placeholder="10000"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Bateria (opcional)</label>
                <input
                  type="text"
                  value={formData.battery}
                  onChange={(e) => setFormData(prev => ({ ...prev, battery: e.target.value }))}
                  className="input-field"
                  placeholder="650mAh"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-2">Descrição (opcional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="input-field"
                  placeholder="Descrição do produto..."
                />
              </div>

              <div className="md:col-span-2 grid grid-cols-2 gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                    className="w-5 h-5 rounded bg-dark-700 border-dark-600 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-white">Produto ativo</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    className="w-5 h-5 rounded bg-dark-700 border-dark-600 text-yellow-500 focus:ring-yellow-500"
                  />
                  <span className="text-white">⭐ Produto em destaque (oferta)</span>
                </label>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/admin/dashboard')}
                className="btn-secondary flex-1"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn-primary flex-1 inline-flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-dark-900 border-t-transparent rounded-full animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <HiSave /> Salvar
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}