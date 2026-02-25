import { Route, Switch } from "wouter";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ErrorBoundary } from "react-error-boundary";

// Public pages
import HomePage from "@/pages/Home";
import LouerPage from "@/pages/louer";
import VendrePage from "@/pages/vendre";
import CategoriesPage from "@/pages/categories";
import AProposPage from "@/pages/APropos";
import ContactPage from "@/pages/contact";
import NotFoundPage from "@/pages/NotFound";
import PropertyDetailsPage from "@/pages/property/[id]";
import CategoryPage from "@/pages/category/[id]";

// Auth pages
import LoginPage from "@/pages/auth/login";
import RegisterPage from "@/pages/auth/register";
import RegistrationPendingPage from "@/pages/auth/RegistrationPending";
import ForgotPasswordPage from "@/pages/auth/ForgotPassword";
import ResetPasswordPage from "@/pages/auth/ResetPassword";

// Dashboard pages
import DashboardPage from "@/pages/dashboard/Dashboard";
import ProfilePage from "@/pages/dashboard/Profile";
import ListingsPage from "@/pages/dashboard/Listings";
import CreateListingPage from "@/pages/dashboard/CreateListing";
import EditListingPage from "@/pages/dashboard/EditListing";
import ListingDetailPage from "@/pages/dashboard/ListingDetails";
import DashboardReservationsPage from "@/pages/dashboard/reservations";
import SubscriptionPage from "@/pages/dashboard/Subscription";
import DashboardSettingsPage from "@/pages/dashboard/settings";
import StatisticsPage from "@/pages/dashboard/Statistics";
import MessagesPage from "@/pages/dashboard/messages";

// Admin pages
import AdminDashboardPage from "@/pages/admin/AdminDashboard";
import AdminProfilePage from "@/pages/admin/AdminProfile";
import UsersManagementPage from "@/pages/admin/UsersManagement";
import ListingsManagementPage from "@/pages/admin/ListingsManagement";
import CategoriesManagementPage from "@/pages/admin/CategoriesManagement";
import SubscriptionManagementPage from "@/pages/admin/SubscriptionManagement";
import AdminNotificationsPage from "@/pages/admin/notifications";
import AdminSettingsPage from "@/pages/admin/AdminSettings";

// Layout
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Toaster } from "sonner";
import { Toaster as ShadcnToaster } from "@/components/ui/toaster";

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
        <PublicLayout><HomePage /></PublicLayout>
      </Route>
      <Route path="/louer">
        <PublicLayout><LouerPage /></PublicLayout>
      </Route>
      <Route path="/vendre">
        <PublicLayout><VendrePage /></PublicLayout>
      </Route>
      <Route path="/categories">
        <PublicLayout><CategoriesPage /></PublicLayout>
      </Route>
      <Route path="/category/:id" component={CategoryPage} />
      <Route path="/apropos">
        <PublicLayout><AProposPage /></PublicLayout>
      </Route>
      <Route path="/contact">
        <PublicLayout><ContactPage /></PublicLayout>
      </Route>
      <Route path="/property/:id" component={PropertyDetailsPage} />

      {/* Routes d'authentification */}
      <Route path="/login" component={LoginPage} />
      <Route path="/auth/login" component={LoginPage} />
      <Route path="/auth/register" component={RegisterPage} />
      <Route path="/registration-pending" component={RegistrationPendingPage} />
      <Route path="/forgot-password" component={ForgotPasswordPage} />
      <Route path="/reset-password" component={ResetPasswordPage} />

      {/* Routes Dashboard utilisateur */}
      <Route path="/dashboard">
        <ProtectedRoute><DashboardPage /></ProtectedRoute>
      </Route>
      <Route path="/dashboard/profile">
        <ProtectedRoute><ProfilePage /></ProtectedRoute>
      </Route>
      <Route path="/dashboard/listings">
        <ProtectedRoute><ListingsPage /></ProtectedRoute>
      </Route>
      <Route path="/dashboard/create-listing">
        <ProtectedRoute><CreateListingPage /></ProtectedRoute>
      </Route>
      <Route path="/dashboard/listings/:id/edit">
        <ProtectedRoute><EditListingPage /></ProtectedRoute>
      </Route>
      <Route path="/dashboard/listings/:id">
        <ProtectedRoute><ListingDetailPage /></ProtectedRoute>
      </Route>
      <Route path="/dashboard/reservations">
        <ProtectedRoute><DashboardReservationsPage /></ProtectedRoute>
      </Route>
      <Route path="/dashboard/subscription">
        <ProtectedRoute><SubscriptionPage /></ProtectedRoute>
      </Route>
      <Route path="/dashboard/settings">
        <ProtectedRoute><DashboardSettingsPage /></ProtectedRoute>
      </Route>
      <Route path="/dashboard/statistics">
        <ProtectedRoute><StatisticsPage /></ProtectedRoute>
      </Route>
      <Route path="/dashboard/messages">
        <ProtectedRoute><MessagesPage /></ProtectedRoute>
      </Route>

      {/* Routes Admin */}
      <Route path="/admin">
        <ProtectedRoute requireAdmin><AdminDashboardPage /></ProtectedRoute>
      </Route>
      <Route path="/admin/profile">
        <ProtectedRoute requireAdmin><AdminProfilePage /></ProtectedRoute>
      </Route>
      <Route path="/admin/users">
        <ProtectedRoute requireAdmin><UsersManagementPage /></ProtectedRoute>
      </Route>
      <Route path="/admin/listings">
        <ProtectedRoute requireAdmin><ListingsManagementPage /></ProtectedRoute>
      </Route>
      <Route path="/admin/categories">
        <ProtectedRoute requireAdmin><CategoriesManagementPage /></ProtectedRoute>
      </Route>
      <Route path="/admin/subscriptions">
        <ProtectedRoute requireAdmin><SubscriptionManagementPage /></ProtectedRoute>
      </Route>
      <Route path="/admin/notifications">
        <ProtectedRoute requireAdmin><AdminNotificationsPage /></ProtectedRoute>
      </Route>
      <Route path="/admin/settings">
        <ProtectedRoute requireAdmin><AdminSettingsPage /></ProtectedRoute>
      </Route>

      {/* 404 */}
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
        window.location.reload();
      }}
    >
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <Toaster 
              position="top-right"
              richColors
              closeButton
              duration={4000}
            />
            <ShadcnToaster />
            <AppRoutes />
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
