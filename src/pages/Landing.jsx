import { mountPage } from '../main.jsx'
import Footer from '../components/layout/Footer.jsx'
import CtaFooter from '../components/landing/CtaFooter.jsx'
import DotBackground from '../components/landing/DotBackground.jsx'
import Hero from '../components/landing/Hero.jsx'
import Navbar from '../components/layout/Navbar.jsx'
import Features from '../components/landing/Features.jsx'
import TantanganKeuangan from '../components/landing/TantanganKeuangan.jsx'
import DashboardPreview from '../components/landing/DashboardPreview.jsx'
import SimulatorPreview from '../components/landing/SimulatorPreview.jsx'


function LandingPage() {
  return (
    <div className="landing-page">
      <svg className="hidden" aria-hidden="true">
        <symbol id="i-wallet" viewBox="0 0 24 24">
          <path d="M20 7H5a2 2 0 0 1 0-4h13v4" />
          <path d="M3 5v14a2 2 0 0 0 2 2h15V7" />
          <circle cx="16.5" cy="14" r="1" />
        </symbol>
      </svg>

      <main>
        <Navbar />
        <div className="landing-hero-shell flex flex-col overflow-hidden bg-hero-bg text-hero-foreground">
          <DotBackground />
          <Hero />
        </div>

        <TantanganKeuangan />
        <Features />
        <DashboardPreview />
        <SimulatorPreview />
        <CtaFooter />
      </main>

      <Footer />
    </div>
  );
}

mountPage(LandingPage)
