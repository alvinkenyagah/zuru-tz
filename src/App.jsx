import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Tours from "./pages/Tours";
import './App.css'
import TourDetail from "./pages/TourDetail";
import AboutUsPage from "./pages/About";
import ContactPage from "./pages/Contact";
import WhatsAppButton from "./components/WhatsAppButton";
import { ToursProvider } from "./context/ToursContext";

function App() {
  return (
    <ToursProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tours" element={<Tours />} />
              <Route path="/tours/:id" element={<TourDetail />} />
              <Route path="/about" element={<AboutUsPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
          </main>
          <Footer />
          <WhatsAppButton />
        </div>
      </Router>
    </ToursProvider>
  );
}

export default App;