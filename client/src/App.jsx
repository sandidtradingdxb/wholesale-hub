import { Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import RequireAdmin from "./components/RequireAdmin";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Policies from "./pages/Policies";
import { COMPANY } from "./config/company";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/policies" element={<Policies />} />
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <Admin />
              </RequireAdmin>
            }
          />
        </Routes>
      </main>
      <footer className="border-t border-ink/10 bg-ink text-paper/70 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-6 text-sm">
          <div>
            <p className="font-display font-600 text-paper text-base mb-2">{COMPANY.name.toUpperCase()}</p>
            <p>{COMPANY.addressLine1}</p>
            <p>{COMPANY.city}, {COMPANY.country}</p>
            <p className="mt-2">
              <Link to="/about" className="hover:text-copper-light transition">
                About us →
              </Link>
            </p>
          </div>
          <div className="font-mono text-xs space-y-1">
            <p>
              <a href={`tel:${COMPANY.phoneTel}`} className="hover:text-copper-light transition">
                {COMPANY.phoneDisplay}
              </a>
            </p>
            <p>
              <a
                href={`https://wa.me/${COMPANY.phoneTel.replace("+", "")}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-copper-light transition"
              >
                WhatsApp us
              </a>
            </p>
            <p>
              <Link to="/contact" className="hover:text-copper-light transition">
                Contact page →
              </Link>
            </p>
            <p>
              <Link to="/terms" className="hover:text-copper-light transition">
                Terms &amp; Conditions →
              </Link>
            </p>
            <p>
              <Link to="/policies" className="hover:text-copper-light transition">
                Policies →
              </Link>
            </p>
          </div>
        </div>
        <p className="text-center text-xs font-mono text-paper/30 mt-8">
          {COMPANY.name} — trade accounts only
        </p>
      </footer>
    </div>
  );
}
