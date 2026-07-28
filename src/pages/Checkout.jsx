import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiCreditCard, HiDocumentText, HiCheck, HiClipboard } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { createCheckout } from '../services/api';

function formatPrice(cents) {
  return `R$ ${(cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    document: '',
    phone: '',
    method: 'pix',
    installments: 1
  });

  const [cardData, setCardData] = useState({
    number: '',
    holder: '',
    expMonth: '',
    expYear: '',
    cvv: ''
  });

  useEffect(() => {
    if (cartItems.length === 0 && !paymentResult) {
      navigate('/produtos');
    }
  }, [cartItems]);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function handleCardChange(e) {
    const { name, value } = e.target;
    setCardData(prev => ({ ...prev, [name]: value }));
  }

  function formatCardNumber(value) {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  }

  function formatExpiry(value) {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    return digits;
  }

  function formatDocument(value) {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  }

  function formatPhone(value) {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        items: cartItems.map(item => ({
          id: item.id,
          quantity: item.quantity,
          flavor: item.flavor
        })),
        customer: {
          name: formData.name,
          email: formData.email,
          document: formData.document.replace(/\D/g, ''),
          phone: formData.phone.replace(/\D/g, ''),
          card: formData.method === 'card' ? {
            number: cardData.number.replace(/\s/g, ''),
            holder: cardData.holder,
            expMonth: cardData.expMonth.split('/')[0] || '',
            expYear: cardData.expYear || cardData.expiry.split('/')[1] || '',
            cvv: cardData.cvv
          } : undefined
        },
        method: formData.method,
        installments: formData.installments
      };

      const result = await createCheckout(payload);
      setPaymentResult(result);
      setStep(2);
      clearCart();
    } catch (error) {
      console.error('Erro no checkout:', error);
      alert('Erro: ' + (error.response?.data?.error || error.message || 'Erro ao processar pagamento'));
    } finally {
      setLoading(false);
    }
  }

  if (step === 2 && paymentResult) {
    const transaction = paymentResult.transaction;
    return (
      <div className="pt-24 pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card p-8 md:p-12 text-center"
          >
            {transaction.method === 'pix' ? (
              <>
                <div className="w-20 h-20 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
                  <svg className="text-green-400 w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z"/>
                  </svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-2">
                  Pagamento via PIX
                </h2>
                <p className="text-gray-400 mb-8">
                  Escaneie o QR Code ou copie o código PIX para pagar
                </p>

                {(transaction.qrCodeUrl || transaction.qrCode) && (
                  <div className="mb-8">
                    {transaction.qrCodeUrl ? (
                      <img
                        src={transaction.qrCodeUrl}
                        alt="QR Code PIX"
                        className="w-64 h-64 mx-auto rounded-2xl bg-white p-4"
                      />
                    ) : (
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(transaction.qrCode)}`}
                        alt="QR Code PIX"
                        className="w-64 h-64 mx-auto rounded-2xl bg-white p-4"
                      />
                    )}
                  </div>
                )}

                {transaction.qrCode && (
                  <div className="space-y-4">
                    <div className="bg-dark-900 rounded-xl p-4 border border-dark-700">
                      <p className="text-xs text-gray-500 mb-2 text-left">Código PIX (Copiar e Colar)</p>
                      <p className="text-sm text-gray-300 break-all text-left font-mono">
                        {transaction.qrCode}
                      </p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(transaction.qrCode)}
                      className="btn-secondary w-full flex items-center justify-center gap-2"
                    >
                      {copied ? <><HiCheck /> Copiado!</> : <><HiClipboard /> Copiar Código PIX</>}
                    </button>
                  </div>
                )}

                <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                  <p className="text-yellow-400 text-sm">
                    ⏰ O PIX expira em 24 horas. Após o pagamento, você será redirecionado automaticamente.
                  </p>
                </div>
              </>
            ) : transaction.method === 'boleto' ? (
              <>
                <div className="w-20 h-20 mx-auto mb-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <HiDocumentText className="text-blue-400 text-4xl" />
                </div>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-2">
                  Boleto Gerado
                </h2>
                <p className="text-gray-400 mb-8">
                  Seu boleto foi gerado com sucesso
                </p>
                {transaction.url && (
                  <a
                    href={transaction.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <HiDocumentText /> Visualizar Boleto
                  </a>
                )}
                {transaction.barcode && (
                  <div className="mt-4 p-4 bg-dark-900 rounded-xl border border-dark-700">
                    <p className="text-xs text-gray-500 mb-2">Código de Barras</p>
                    <p className="text-sm text-gray-300 font-mono">{transaction.barcode}</p>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="w-20 h-20 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
                  <HiCheck className="text-green-400 text-4xl" />
                </div>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-2">
                  Pagamento Aprovado!
                </h2>
                <p className="text-gray-400 mb-8">
                  Seu pedido foi confirmado com sucesso
                </p>
              </>
            )}

            <div className="mt-8 space-y-3">
              <p className="text-gray-400">
                <span className="text-white font-semibold">Valor:</span> {formatPrice(transaction.amount)}
              </p>
              <p className="text-gray-400">
                <span className="text-white font-semibold">Status:</span>{' '}
                <span className="text-yellow-400 capitalize">{transaction.status}</span>
              </p>
              {transaction.id && (
                <p className="text-gray-500 text-xs">
                  ID: {transaction.id}
                </p>
              )}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate('/')}
                className="btn-secondary"
              >
                Voltar ao Início
              </button>
              <button
                onClick={() => navigate('/produtos')}
                className="btn-primary"
              >
                Continuar Comprando
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-primary-400 transition-colors mb-8"
        >
          <HiArrowLeft /> Voltar
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-3xl font-heading font-bold text-white mb-8">
                Finalizar <span className="gradient-text">Pedido</span>
              </h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Data */}
                <div className="card p-6 md:p-8">
                  <h2 className="text-xl font-heading font-semibold text-white mb-6">
                    Dados do Cliente
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-400 mb-2">Nome Completo *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Seu nome completo"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="seu@email.com"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Telefone</label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: formatPhone(e.target.value) }))}
                        placeholder="(11) 99999-9999"
                        className="input-field"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-400 mb-2">CPF *</label>
                      <input
                        type="text"
                        name="document"
                        value={formData.document}
                        onChange={(e) => setFormData(prev => ({ ...prev, document: formatDocument(e.target.value) }))}
                        required
                        placeholder="000.000.000-00"
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="card p-6 md:p-8">
                  <h2 className="text-xl font-heading font-semibold text-white mb-6">
                    Forma de Pagamento
                  </h2>
                  <div className="grid md:grid-cols-3 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, method: 'pix' }))}
                      className={`p-6 rounded-xl border-2 text-center transition-all ${
                        formData.method === 'pix'
                          ? 'border-primary-500 bg-primary-500/10'
                          : 'border-dark-700 bg-dark-800 hover:border-primary-500/30'
                      }`}
                    >
                      <svg className={`w-8 h-8 mx-auto mb-2 ${formData.method === 'pix' ? 'text-primary-400' : 'text-gray-400'}`} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z"/>
                      </svg>
                      <p className={`font-semibold text-sm ${formData.method === 'pix' ? 'text-primary-400' : 'text-gray-300'}`}>PIX</p>
                      <p className="text-xs text-gray-500 mt-1">Aprovação na hora</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, method: 'card' }))}
                      className={`p-6 rounded-xl border-2 text-center transition-all ${
                        formData.method === 'card'
                          ? 'border-primary-500 bg-primary-500/10'
                          : 'border-dark-700 bg-dark-800 hover:border-primary-500/30'
                      }`}
                    >
                      <HiCreditCard className={`text-3xl mx-auto mb-2 ${formData.method === 'card' ? 'text-primary-400' : 'text-gray-400'}`} />
                      <p className={`font-semibold text-sm ${formData.method === 'card' ? 'text-primary-400' : 'text-gray-300'}`}>Cartão</p>
                      <p className="text-xs text-gray-500 mt-1">Parcele em até 12x</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, method: 'boleto' }))}
                      className={`p-6 rounded-xl border-2 text-center transition-all ${
                        formData.method === 'boleto'
                          ? 'border-primary-500 bg-primary-500/10'
                          : 'border-dark-700 bg-dark-800 hover:border-primary-500/30'
                      }`}
                    >
                      <HiDocumentText className={`text-3xl mx-auto mb-2 ${formData.method === 'boleto' ? 'text-primary-400' : 'text-gray-400'}`} />
                      <p className={`font-semibold text-sm ${formData.method === 'boleto' ? 'text-primary-400' : 'text-gray-300'}`}>Boleto</p>
                      <p className="text-xs text-gray-500 mt-1">Vence em 3 dias</p>
                    </button>
                  </div>

                  {/* Card Details */}
                  {formData.method === 'card' && (
                    <div className="mt-6 space-y-4">
                      <h3 className="text-lg font-heading font-semibold text-white">Dados do Cartão</h3>
                      
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Número do Cartão *</label>
                        <input
                          type="text"
                          name="number"
                          value={cardData.number}
                          onChange={handleCardChange}
                          required
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                          className="input-field"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Nome no Cartão *</label>
                        <input
                          type="text"
                          name="holder"
                          value={cardData.holder}
                          onChange={handleCardChange}
                          required
                          placeholder="JOÃO SILVA"
                          className="input-field"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Mês *</label>
                          <input
                            type="text"
                            name="expMonth"
                            value={cardData.expMonth}
                            onChange={handleCardChange}
                            required
                            placeholder="MM"
                            maxLength="2"
                            className="input-field"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Ano *</label>
                          <input
                            type="text"
                            name="expYear"
                            value={cardData.expYear}
                            onChange={handleCardChange}
                            required
                            placeholder="YYYY"
                            maxLength="4"
                            className="input-field"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">CVV *</label>
                          <input
                            type="text"
                            name="cvv"
                            value={cardData.cvv}
                            onChange={handleCardChange}
                            required
                            placeholder="123"
                            maxLength="4"
                            className="input-field"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Parcelas *</label>
                        <select
                          value={formData.installments}
                          onChange={(e) => setFormData(prev => ({ ...prev, installments: parseInt(e.target.value) }))}
                          className="input-field"
                        >
                          {[1,2,3,4,5,6,7,8,9,10,11,12].map(x => (
                            <option key={x} value={x}>{x}x de {formatPrice(Math.round(cartTotal / x))}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-dark-900 border-t-transparent rounded-full animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <HiCreditCard /> Pagar {formatPrice(cartTotal)}
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card p-6"
              >
                <h2 className="text-lg font-heading font-semibold text-white mb-6">
                  Resumo do Pedido
                </h2>

                <div className="space-y-4 mb-6">
                  {cartItems.map((item, index) => (
                    <div key={`${item.id}-${item.flavor}-${index}`} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-dark-700 flex items-center justify-center shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                        ) : (
                          <span>📦</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{item.name}</p>
                        {item.flavor && <p className="text-xs text-gray-500">Sabor: {item.flavor}</p>}
                        <p className="text-xs text-gray-500">Qtd: {item.quantity}</p>
                      </div>
                      <p className="text-sm text-primary-400 font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-4 border-t border-dark-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white">{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Frete</span>
                    <span className="text-green-400">Grátis</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-dark-700">
                    <span className="text-white font-heading font-bold">Total</span>
                    <span className="text-primary-400 font-heading font-bold text-xl">
                      {formatPrice(cartTotal)}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}