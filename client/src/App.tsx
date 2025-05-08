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
import NotFoundPage from '@/pages/NotFound';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';

// Protected route component
function ProtectedRoute({ component: Component, ...rest }: { component: React.ComponentType }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!user) {
    return <Redirect to="/auth/login" />;
  }

  return <Component {...rest} />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <div className="flex-grow">
            <Switch>
              {/* Public routes */}
              <Route path="/" component={HomePage} />
              <Route path="/acheter" component={AcheterPage} />
              <Route path="/louer" component={LouerPage} />
              <Route path="/vendre" component={VendrePage} />
              <Route path="/categories" component={CategoriesPage} />
              <Route path="/about" component={AProposPage} />
              <Route path="/contact" component={ContactPage} />
              <Route path="/auth/login" component={LoginPage} />

              {/* Protected dashboard routes */}
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
              <Route component={NotFoundPage} />
            </Switch>
          </div>
          <Footer />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}
