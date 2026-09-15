import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLocale } from '@/lib/locale';
import { register } from '@/services/api';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import AuthLayout from '@/components/AuthLayout';
import { FormError, primaryButtonClass, TextField } from '@/components/SiteForm';
import Spinner from '@/components/Spinner';

export default function RegisterPage() {
  const { t } = useLocale();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  useDocumentTitle(`${t('auth.signUp')} | MenuQR`);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setError('');
    setSubmitting(true);
    try {
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
    } catch {
      setError(t('auth.registerFailed'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title={t('auth.createAccount')}
      subtitle={t('auth.registerSubtitle')}
      footer={
        <>
          {t('auth.hasAccount')}{' '}
          <Link to="/login" className="font-bold text-primary-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded">
            {t('auth.logIn')}
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormError>{error}</FormError>
        <TextField id="register-name" label={t('auth.name')} type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required />
        <TextField
          id="register-email"
          label={t('auth.email')}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          id="register-password"
          label={t('auth.password')}
          type="password"
          autoComplete="new-password"
          hint={t('auth.passwordHint')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />
        <button type="submit" className={`${primaryButtonClass} mt-2 w-full`} disabled={submitting}>
          {submitting && <Spinner className="h-4 w-4" />}
          {submitting ? t('auth.creating') : t('auth.signUp')}
        </button>
      </form>
    </AuthLayout>
  );
}
