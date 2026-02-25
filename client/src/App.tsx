import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ErrorBoundary } from "react-error-boundary";

// Public pages (eager — on the critical path)
import HomePage from "@/pages/Home";
import LouerPage from "@/pages/louer";
import VendrePage from "@/pages/vendre";
import CategoriesPage from "@/pages/categories";
import AProposPage from "@/pages/APropos";
import ContactPage from "@/pages/contact";
import NotFoundPage from "@/pages/NotFound";
import PropertyDetailsPage from "@/pages/property/[id]";
import CategoryPage from "@/pages/category/[id]";

// Auth pages (eager — needed on first interaction)
import LoginPage from "@/pages/auth/login";
import RegisterPage from "@/pages/auth/register";

// Auth pages (lazy)
const RegistrationPendingPage = lazy(() => import("@/pages/auth/RegistrationPending"));
const ForgotPasswordPage = lazy(() => import("@/pages/auth/ForgotPassword"));
const ResetPasswordPage = lazy(() => import("@/pages/auth/ResetPassword"));

// Dashboard pages (lazy)
const DashboardPage = lazy(() => import("@/pages/dashboard/Dashboard"));
const ProfilePage = lazy(() => import("@/pages/dashboard/Profile"));
const ListingsPage = lazy(() => import("@/pages/dashboard/Listings"));
const CreateListingPage = lazy(() => import("@/pages/dashboard/CreateListing"));
const EditListingPage = lazy(() => import("@/pages/dashboard/EditListing"));
const ListingDetailPage = lazy(() => import("@/pages/dashboard/ListingDetails"));
const DashboardReservationsPage = lazy(() => import("@/pages/dashboard/reservations"));
const SubscriptionPage = lazy(() => import("@/pages/dashboard/Subscription"));
const DashboardSettingsPage = lazy(() => import("@/pages/dashboard/settings"));
const StatisticsPage = lazy(() => import("@/pages/dashboard/Statistics"));
const MessagesPage = lazy(() => import("@/pages/dashboard/messages"));

// Admin pages (lazy)
const AdminDashboardPage = lazy(() => import("@/pages/admin/AdminDashboard"));
const AdminProfilePage = lazy(() => import("@/pages/admin/AdminProfile"));
const UsersManagementPage = lazy(() => import("@/pages/admin/UsersManagement"));
const ListingsManagementPage = lazy(() => import("@/pages/admin/ListingsManagement"));
const CategoriesManagementPage = lazy(() => import("@/pages/admin/CategoriesManagement"));
const SubscriptionManagementPage = lazy(() => import("@/pages/admin/SubscriptionManagement"));
const AdminNotificationsPage = lazy(() => import("@/pages/admin/notifications"));
const AdminSettingsPage = lazy(() => import("@/pages/admin/AdminSettings"));

// Layout
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Toaster } from "sonner";
import { Toaster as ShadcnToaster } from "@/components/ui/toaster";

// Shared page-level loading fallback
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

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
    <Suspense fallback={<PageLoader />}>
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
    </Suspense>
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
