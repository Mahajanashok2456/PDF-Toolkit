import React, { Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Dashboard from "./components/Dashboard";
import MergePage from "./components/MergePage";
import SplitPage from "./components/SplitPage";
import ConvertPage from "./components/ConvertPage";
import OrganizePage from "./components/OrganizePage";
import SecurityPage from "./components/SecurityPage";
import AboutPage from "./components/AboutPage";
import FAQPage from "./components/FAQPage";
import SEO from "./components/SEO";

// Lazy load pages for code splitting
const PrivacyPolicy = React.lazy(() => import("./components/PrivacyPolicy"));
const TermsOfService = React.lazy(() => import("./components/TermsOfService"));
const SupportPage = React.lazy(() => import("./components/SupportPage"));
const ContactUs = React.lazy(() => import("./components/ContactUs"));

// Component to handle scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App({ Router = BrowserRouter }) {
  return (
    <Router>
      <SEO />
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Suspense
            fallback={
              <div className="min-h-screen bg-modern-calm-ink-black flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-modern-calm-dusk-blue mx-auto mb-4"></div>
                  <p className="text-modern-calm-alabaster-grey">Loading...</p>
                </div>
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/merge-pdf" element={<MergePage />} />
              <Route path="/split-pdf" element={<SplitPage />} />
              <Route path="/convert-pdf" element={<ConvertPage />} />
              <Route path="/organize-pdf" element={<OrganizePage />} />
              <Route path="/pdf-security" element={<SecurityPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/contact-us" element={<ContactUs />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
