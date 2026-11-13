import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { LocaleProvider } from '@/lib/locale';
import DashboardLayout from '@/layouts/DashboardLayout';
import AdminLayout from '@/layouts/AdminLayout';
import { AboutPageSkeleton, MenuPageSkeleton } from '@/components/Skeleton';
import Spinner from '@/components/Spinner';

const HomePage = lazy(() => import('@/pages/HomePage'));
const FeaturesPage = lazy(() => import('@/pages/FeaturesPage'));
const PricingPage = lazy(() => import('@/pages/PricingPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'));
const DashboardMenuPage = lazy(() => import('@/pages/dashboard/MenuPage'));
const NewCategoryPage = lazy(() => import('@/pages/dashboard/NewCategoryPage'));
const EditCategoryPage = lazy(() => import('@/pages/dashboard/EditCategoryPage'));
const NewProductPage = lazy(() => import('@/pages/dashboard/NewProductPage'));
const EditProductPage = lazy(() => import('@/pages/dashboard/EditProductPage'));
const RestaurantSettingsPage = lazy(() => import('@/pages/dashboard/RestaurantSettingsPage'));
const QRPage = lazy(() => import('@/pages/dashboard/QRPage'));
const AdminOverviewPage = lazy(() => import('@/pages/admin/OverviewPage'));
const AdminRestaurantsPage = lazy(() => import('@/pages/admin/RestaurantsPage'));
const AdminSubscriptionsPage = lazy(() => import('@/pages/admin/SubscriptionsPage'));
const AdminContactMessagesPage = lazy(() => import('@/pages/admin/ContactMessagesPage'));
const RestaurantLandingPage = lazy(() => import('@/pages/restaurant/RestaurantLandingPage'));
const MenuPage = lazy(() => import('@/pages/restaurant/MenuPage'));
const ProductPage = lazy(() => import('@/pages/restaurant/ProductPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

function PageLoader({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="menu-bg flex min-h-screen items-center justify-center"><Spinner className="h-8 w-8 text-primary-600" /></div>}>{children}</Suspense>;
}

function RootWrapper({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider defaultLocale="ar" enabledLocales={['en', 'ar']} currency="USD">
      {children}
    </LocaleProvider>
  );
}

export const router = createBrowserRouter([
  {
    element: <RootWrapper><PageLoader><HomePage /></PageLoader></RootWrapper>,
    path: '/',
  },
  { path: '/features', element: <RootWrapper><PageLoader><FeaturesPage /></PageLoader></RootWrapper> },
  { path: '/pricing', element: <RootWrapper><PageLoader><PricingPage /></PageLoader></RootWrapper> },
  { path: '/contact', element: <RootWrapper><PageLoader><ContactPage /></PageLoader></RootWrapper> },
  { path: '/login', element: <RootWrapper><PageLoader><LoginPage /></PageLoader></RootWrapper> },
  { path: '/register', element: <RootWrapper><PageLoader><RegisterPage /></PageLoader></RootWrapper> },
  {
    path: '/dashboard',
    element: <RootWrapper><DashboardLayout /></RootWrapper>,
    children: [
      { index: true, element: <PageLoader><DashboardPage /></PageLoader> },
      { path: 'menu', element: <PageLoader><DashboardMenuPage /></PageLoader> },
      { path: 'menu/categories/new', element: <PageLoader><NewCategoryPage /></PageLoader> },
      { path: 'menu/categories/:id', element: <PageLoader><EditCategoryPage /></PageLoader> },
      { path: 'menu/products/new', element: <PageLoader><NewProductPage /></PageLoader> },
      { path: 'menu/products/:id', element: <PageLoader><EditProductPage /></PageLoader> },
      { path: 'restaurant', element: <PageLoader><RestaurantSettingsPage /></PageLoader> },
      { path: 'qr', element: <PageLoader><QRPage /></PageLoader> },
    ],
  },
  {
    path: '/admin',
    element: <RootWrapper><AdminLayout /></RootWrapper>,
    children: [
      { index: true, element: <PageLoader><AdminOverviewPage /></PageLoader> },
      { path: 'restaurants', element: <PageLoader><AdminRestaurantsPage /></PageLoader> },
      { path: 'subscriptions', element: <PageLoader><AdminSubscriptionsPage /></PageLoader> },
      { path: 'contact', element: <PageLoader><AdminContactMessagesPage /></PageLoader> },
    ],
  },
  {
    path: '/restaurant/:slug',
    element: (
      <Suspense fallback={<AboutPageSkeleton />}>
        <RestaurantLandingPage />
      </Suspense>
    ),
  },
  {
    path: '/restaurant/:slug/menu',
    element: (
      <Suspense fallback={<MenuPageSkeleton />}>
        <MenuPage />
      </Suspense>
    ),
  },
  { path: '/restaurant/:slug/product/:productSlug', element: <PageLoader><ProductPage /></PageLoader> },
  { path: '*', element: <RootWrapper><PageLoader><NotFoundPage /></PageLoader></RootWrapper> },
]);
