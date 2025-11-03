import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Hero } from "@/components/Hero";
import { Dashboard } from "@/components/Dashboard";
import { Footer } from "@/components/Footer";

const Index = () => {
  const [showDashboard, setShowDashboard] = useState(false);

  return (
    <div className="relative min-h-screen">
      <AnimatePresence mode="wait">
        {!showDashboard ? (
          <Hero key="hero" onEnter={() => setShowDashboard(true)} />
        ) : (
          <Dashboard key="dashboard" />
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
};

export default Index;
