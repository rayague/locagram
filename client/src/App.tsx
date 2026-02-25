import { Route, Switch } from "wouter";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ErrorBoundary } from "react-error-boundary";
import HomePage from "@/pages/Home";
import LouerPage from "@/pages/louer";
import VendrePage from "@/pages/vendre";
import CategoriesPage from "@/pages/categories";
import CategoryPage from "@/pages/category/[id]";
import AProposPage from "@/pages/APropos";
import ContactPage from "@/pages/contact";
import DashboardPage from "@/pages/dashboard";
import AnnoncesPage from "@/pages/dashboard/annonces";
import ReservationsPage from "@/pages/dashboard/reservations";
import MessagesPage from "@/pages/dashboard/messages";
import CategoriesDashboardPage from "@/pages/dashboard/categories";
import UsersPage from "@/pages/dashboard/users";
import SettingsPage from "@/pages/dashboard/settings";
import LoginPage from "@/pages/auth/login";
import RegisterPage from "@/pages/auth/register";
import NotFoundPage from "@/pages/NotFound";
import PropertyDetailsPage from "@/pages/property/[id]";
import AdminNotificationsPage from "@/pages/admin/notifications";
import AdminContactMessagesPage from "@/pages/admin/ContactMessages";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Toaster } from "sonner";

// Error fallback component
function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  console.error("App Error:", error);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="text-center max-w-md mx-auto p-6">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Oups! Une erreur est survenue
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {error.message || "Une erreur inattendue s'est produite"}
        </p>
        <button
          onClick={resetErrorBoundary}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Réessayer
        </button>
        <button
          onClick={() => window.location.href = "/"}
          className="ml-4 bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}

// Layout component for public routes
function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">{children}</div>
      <Footer />
    </div>
  );
}

// Main App routes
function AppRoutes() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {/* Routes publiques */}
      <Route path="/" exact>
        <PublicLayout>
          <HomePage />
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
      
      <Route path="/category/:id" component={CategoryPage} />
      
      <Route path="/apropos">
        <PublicLayout>
          <AProposPage />
        </PublicLayout>
      </Route>
      
      <Route path="/contact">
        <PublicLayout>
          <ContactPage />
        </PublicLayout>
      </Route>
      
      <Route path="/property/:id" component={PropertyDetailsPage} />
      
      {/* Routes d'authentification */}
      <Route path="/login" component={LoginPage} />
      <Route path="/auth/login" component={LoginPage} />
      <Route path="/auth/register" component={RegisterPage} />
      
      {/* Routes protégées - Dashboard utilisateur */}
      <Route path="/dashboard" exact>
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/dashboard/annonces">
        <ProtectedRoute>
          <AnnoncesPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/dashboard/reservations">
        <ProtectedRoute>
          <ReservationsPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/dashboard/messages">
        <ProtectedRoute>
          <MessagesPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/dashboard/categories">
        <ProtectedRoute requireAdmin>
          <CategoriesDashboardPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/dashboard/users">
        <ProtectedRoute requireAdmin>
          <UsersPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/dashboard/settings">
        <ProtectedRoute>
          <SettingsPage />
        </ProtectedRoute>
      </Route>
      
      {/* Routes Admin */}
      <Route path="/admin/users">
        <ProtectedRoute requireAdmin>
          <UsersPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/admin/notifications">
        <ProtectedRoute requireAdmin>
          <AdminNotificationsPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/admin/contact-messages">
        <ProtectedRoute requireAdmin>
          <AdminContactMessagesPage />
        </ProtectedRoute>
      </Route>
      
      {/* 404 - Toutes les autres routes */}
      <Route component={NotFoundPage} />
    </Switch>
  );
}

export default function App() {
  console.log("App component mounted");
  
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error("Global Error Boundary:", error, errorInfo);
      }}
      onReset={() => {
        // Optionnel: reset d'état global
        window.location.reload();
      }}
    >
      <ThemeProvider>
        <AuthProvider>
          <Toaster 
            position="top-right"
            richColors
            closeButton
            duration={4000}
          />
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
