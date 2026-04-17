import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AgentWidget from './components/AgentWidget';
import ScrollToTop from './components/ScrollToTop';
import CookieBanner from './components/CookieBanner';
import Home from './pages/Home';
import Tools from './pages/Tools';
import Equipment from './pages/Equipment';
import Training from './pages/Training';

const App = () => (
  <>
    <ScrollToTop />

    {/* Skip link — first focusable element on every page, visible on keyboard focus */}
    <a href="#main-content" className="skip-link">
      Skip to main content
    </a>

    <Navbar />

    {/*
      id="main-content" is the skip-link target.
      tabIndex={-1} allows programmatic focus without showing a browser focus ring.
    */}
    <main id="main-content" tabIndex={-1} role="main">
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/tools"     element={<Tools />} />
        <Route path="/equipment" element={<Equipment />} />
        <Route path="/training"  element={<Training />} />
      </Routes>
    </main>

    <Footer />
    <AgentWidget />
    <CookieBanner />
  </>
);

export default App;
