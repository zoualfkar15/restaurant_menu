import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLocale } from '@/lib/locale';
import { login } from '@/services/api';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import AuthLayout from '@/components/AuthLayout';
import { FormError, primaryButtonClass, TextField } from '@/components/SiteForm';
import Spinner from '@/components/Spinner';

export default function LoginPage() {
  const { t } = useLocale();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  useDocumentTitle(`${t('auth.logIn')} | MenuQR`);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setError('');
    setSubmitting(true);
    try {
      const { res, data } = await login(email, password);
      if (!res.ok) {
        setError(data.message || t('auth.loginFailed'));
        return;
      }
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
      }
      if (data.user?.role === 'PLATFORM_OWNER') navigate('/admin');
      else navigate('/dashboard');
    } catch {
      setError(t('auth.loginFailed'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title={t('auth.logIn')}
      subtitle={t('auth.loginSubtitle')}
      footer={
        <>
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="font-bold text-primary-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded">
            {t('auth.signUp')}
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormError>{error}</FormError>
        <TextField
          id="login-email"
          label={t('auth.email')}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          id="login-password"
          label={t('auth.password')}
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className={`${primaryButtonClass} mt-2 w-full`} disabled={submitting}>
          {submitting && <Spinner className="h-4 w-4" />}
          {submitting ? t('auth.loggingIn') : t('auth.logIn')}
        </button>
      </form>
    </AuthLayout>
  );
}
