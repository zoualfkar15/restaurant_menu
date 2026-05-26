import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLocale } from '@/lib/locale';
import { register } from '@/services/api';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function RegisterPage() {
  const { t } = useLocale();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  useDocumentTitle(`${t('auth.signUp')} | MenuQR`);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const { res, data } = await register(name, email, password);
    if (!res.ok) {
      setError(data.message || t('auth.registerFailed'));
      return;
    }
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
      if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
    }
    navigate('/dashboard');
  }

  const inputClass = 'w-full border border-slate-300 rounded-lg px-3 py-2.5 bg-white text-slate-900 focus:ring-2 focus:ring-brand-500';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-slate-50">
      <div className="w-full max-w-sm p-6 sm:p-8 rounded-2xl bg-white shadow-lg border border-slate-200">
        <Link to="/" className="block text-center text-xl font-bold text-slate-900 mb-8">MenuQR</Link>
        <h1 className="text-2xl font-bold text-slate-900 mb-6">{t('auth.createAccount')}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-slate-800 mb-1">{t('auth.name')}</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-800 mb-1">{t('auth.email')}</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-800 mb-1">{t('auth.password')}</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} required minLength={8} />
          </div>
          <button type="submit" className="w-full bg-brand-500 text-white py-2.5 rounded-lg font-medium hover:bg-brand-600">{t('auth.signUp')}</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          {t('auth.hasAccount')} <Link to="/login" className="text-brand-500 font-medium hover:underline">{t('auth.logIn')}</Link>
        </p>
      </div>
    </div>
  );
}
