import { Switch, Route } from "wouter";
import { AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import HomePage from "@/pages/Home";
import AcheterPage from "@/pages/acheter";
import LouerPage from "@/pages/louer";
import VendrePage from "@/pages/vendre";
import AboutPage from "@/pages/about";
import ContactPage from "@/pages/contact";
import CategoriesPage from "@/pages/categories";
import CategoryDetailPage from "@/pages/category-detail";
import LoginPage from "@/pages/auth/login";
import RegisterPage from "@/pages/auth/register";
import NotFound from "@/pages/not-found";
import PropertyDetail from "@/pages/PropertyDetail";
import PropertyListing from "@/pages/PropertyListing";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import logo from './assets/logo-locagram.png';

function App() {
  const [location] = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <AnimatePresence mode="wait">
        <Switch location={location} key={location}>
          <Route path="/" component={HomePage} />
          <Route path="/acheter" component={AcheterPage} />
          <Route path="/louer" component={LouerPage} />
          <Route path="/vendre" component={VendrePage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/contact" component={ContactPage} />
          <Route path="/categories" component={CategoriesPage} />
          <Route path="/category" component={CategoryDetailPage} />
          <Route path="/auth/login" component={LoginPage} />
          <Route path="/auth/register" component={RegisterPage} />
          <Route path="/properties" component={PropertyListing} />
          <Route path="/property/:id" component={PropertyDetail} />
          <Route component={NotFound} />
        </Switch>
      </AnimatePresence>
      <Footer />
    </div>
  );
}

export default App;
