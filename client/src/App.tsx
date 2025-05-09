import { Route, Switch, Redirect } from 'wouter';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import HomePage from '@/pages/Home';
import AcheterPage from '@/pages/Acheter';
import LouerPage from '@/pages/Louer';
import VendrePage from '@/pages/Vendre';
import CategoriesPage from '@/pages/Categories';
import AProposPage from '@/pages/APropos';
import ContactPage from '@/pages/Contact';
import DashboardPage from '@/pages/dashboard';
import AnnoncesPage from '@/pages/dashboard/annonces';
import ReservationsPage from '@/pages/dashboard/reservations';
import MessagesPage from '@/pages/dashboard/messages';
import CategoriesDashboardPage from '@/pages/dashboard/categories';
import UsersPage from '@/pages/dashboard/users';
import SettingsPage from '@/pages/dashboard/settings';
import LoginPage from '@/pages/auth/Login';
import RegisterPage from '@/pages/auth/register';
import NotFoundPage from '@/pages/NotFound';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';

// Protected route component
function ProtectedRoute({ component: Component, ...rest }: { component: React.ComponentType }) {
  const { user } = useAuth();

  if (!user) {
    return <Redirect to="/auth/login" />;
  }

  return <Component {...rest} />;
}

// Layout component for public routes
function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        {children}
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Switch>
          {/* Public routes with layout */}
          <Route path="/">
            <PublicLayout>
              <HomePage />
            </PublicLayout>
          </Route>
          <Route path="/acheter">
            <PublicLayout>
              <AcheterPage />
            </PublicLayout>
          </Route>
          <Route path="/louer">
            <PublicLayout>
              <LouerPage />
            </PublicLayout>
          </Route>
          <Route path="/vendre">
            <PublicLayout>
              <VendrePage />
            </PublicLayout>
          </Route>
          <Route path="/categories">
            <PublicLayout>
              <CategoriesPage />
            </PublicLayout>
          </Route>
          <Route path="/about">
            <PublicLayout>
              <AProposPage />
            </PublicLayout>
          </Route>
          <Route path="/contact">
            <PublicLayout>
              <ContactPage />
            </PublicLayout>
          </Route>
          <Route path="/auth/login">
            <PublicLayout>
              <LoginPage />
            </PublicLayout>
          </Route>
          <Route path="/auth/register">
            <PublicLayout>
              <RegisterPage />
            </PublicLayout>
          </Route>

          {/* Protected dashboard routes without public layout */}
          <Route path="/dashboard">
            <ProtectedRoute component={DashboardPage} />
          </Route>
          <Route path="/dashboard/annonces">
            <ProtectedRoute component={AnnoncesPage} />
          </Route>
          <Route path="/dashboard/reservations">
            <ProtectedRoute component={ReservationsPage} />
          </Route>
          <Route path="/dashboard/messages">
            <ProtectedRoute component={MessagesPage} />
          </Route>
          <Route path="/dashboard/categories">
            <ProtectedRoute component={CategoriesDashboardPage} />
          </Route>
          <Route path="/dashboard/users">
            <ProtectedRoute component={UsersPage} />
          </Route>
          <Route path="/dashboard/settings">
            <ProtectedRoute component={SettingsPage} />
          </Route>

          {/* 404 page */}
          <Route>
            <PublicLayout>
              <NotFoundPage />
            </PublicLayout>
          </Route>
        </Switch>
      </AuthProvider>
    </ThemeProvider>
  );
}
