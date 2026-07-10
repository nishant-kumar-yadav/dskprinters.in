import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import WhatsAppButton from './components/WhatsAppButton.jsx'
import MobileBottomNav from './components/MobileBottomNav.jsx'
import ColdStartBanner from './components/ColdStartBanner.jsx'
import { QuoteModalProvider } from './components/QuoteModal.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Products from './pages/Products.jsx'
import CategoryPage from './pages/CategoryPage.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Reviews from './pages/Reviews.jsx'
import Contact from './pages/Contact.jsx'
import SeoLandingPage from './pages/SeoLandingPage.jsx'
import SearchResults from './pages/SearchResults.jsx'
import Admin from './admin/Admin.jsx'
import NotFound from './pages/NotFound.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  useEffect(() => {
    document.body.classList.toggle('has-bottom-nav', !isAdmin)
  }, [isAdmin])

  if (isAdmin) {
    return <Admin />
  }

  return (
    <QuoteModalProvider>
      <ScrollToTop />
      <ColdStartBanner />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/s/:keyword" element={<SeoLandingPage />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppButton />
      <MobileBottomNav />
    </QuoteModalProvider>
  )
}
