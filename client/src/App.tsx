import { Switch, Route } from "wouter";
import { AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import HomePage from "@/pages/Home";
import NotFound from "@/pages/not-found";
import PropertyDetail from "@/pages/PropertyDetail";
import PropertyListing from "@/pages/PropertyListing";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function App() {
  const [location] = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <AnimatePresence mode="wait">
        <Switch location={location} key={location}>
          <Route path="/" component={HomePage} />
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
