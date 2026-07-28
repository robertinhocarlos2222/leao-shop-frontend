import { useState } from 'react';

export default function Debug() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function testAPI() {
    setLoading(true);
    try {
      const response = await fetch('https://leao-shop-backend.onrender.com/api/test-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-heading font-bold text-white mb-8">
          🧪 Debug - Teste de API
        </h1>

        <div className="card p-8 mb-8">
          <h2 className="text-2xl font-heading font-semibold text-white mb-4">
            Testar Conexão com SillientPay
          </h2>
          <p className="text-gray-400 mb-6">
            Este botão vai testar a API da SillientPay e mostrar o resultado exato (sucesso ou erro).
          </p>
          
          <button
            onClick={testAPI}
            disabled={loading}
            className="btn-primary w-full py-4 text-lg"
          >
            {loading ? 'Testando...' : '🧪 Testar API da SillientPay'}
          </button>
        </div>

        {result && (
          <div className="card p-8">
            <h3 className="text-xl font-heading font-semibold text-white mb-4">
              Resultado:
            </h3>
            <pre className="bg-dark-900 p-6 rounded-xl overflow-auto max-h-96 text-sm text-gray-300">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}