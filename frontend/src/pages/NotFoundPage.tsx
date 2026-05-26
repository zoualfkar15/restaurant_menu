import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-slate-50">
      <h1 className="text-6xl font-bold text-slate-300">404</h1>
      <p className="text-slate-600 mt-4 mb-8">Page not found</p>
      <Link to="/" className="bg-brand-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-600">Go home</Link>
    </div>
  );
}
