
import React, { useEffect, useState, createContext, useContext } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import Materials from "./pages/Materials";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NotFound from "./pages/NotFound";
import IntegrationTest from "./pages/IntegrationTest";

// Test Components
import { ContentIntegrationTest } from "./tests/ContentIntegrationTest";

const queryClient = new QueryClient();

// Language context and provider
const LanguageContext = createContext({
  language: "en",
  setLanguage: (lang: string) => {},
});

export const useLanguage = () => useContext(LanguageContext);

const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<string | null>(null);

  // Remove localStorage logic for hiding popup; always show on reload
  useEffect(() => {
    setLanguage(null); // Always reset on mount
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

const LanguagePopup = () => {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(true);

  const handleSelect = (lang: string) => {
    setLanguage(lang);
    setOpen(false);
  };

  // Always show popup until language is selected
  if (language) return null;
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.5)", zIndex: 9999,
      display: "flex", alignItems: "center", justifyContent: "center",
      backdropFilter: "blur(8px)"
    }}>
      <div style={{ background: "white", padding: 32, borderRadius: 12, boxShadow: "0 2px 16px rgba(0,0,0,0.2)", minWidth: 300, textAlign: "center" }}>
        <h2 style={{ marginBottom: 24 }}>Select Language / भाषा चुनें</h2>
        <button onClick={() => handleSelect("en")}
          style={{ margin: 8, padding: "12px 32px", fontSize: 18, borderRadius: 6, border: "1px solid #ccc", background: "#f5f5f5", cursor: "pointer" }}>
          English
        </button>
        <button onClick={() => handleSelect("hi")}
          style={{ margin: 8, padding: "12px 32px", fontSize: 18, borderRadius: 6, border: "1px solid #ccc", background: "#f5f5f5", cursor: "pointer" }}>
          हिंदी
        </button>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <LanguageProvider>
      <LanguagePopup />
      <LanguageContent />
    </LanguageProvider>
  );
};

const LanguageContent = () => {
  const { language } = useLanguage();
  // Blur the background until language is selected
  if (!language) {
    return (
      <div style={{ filter: "blur(8px)", pointerEvents: "none", userSelect: "none", minHeight: "100vh" }} />
    );
  }
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/test/integration" element={<ContentIntegrationTest />} />
            <Route path="/test/comprehensive" element={<IntegrationTest />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
