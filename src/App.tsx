import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { ScrollToTop } from "@/components/layout/ScrollToTop";

// Pages
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CategoryPage from "./pages/CategoryPage";
import CheckoutPage from "./pages/CheckoutPage";
import TrackingPage from "./pages/TrackingPage";
import SearchPage from "./pages/SearchPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import ExchangesPage from "./pages/ExchangesPage";
import NotFound from "./pages/NotFound";
import OrderStatusPage from "./pages/OrderStatusPage";

// Admin Pages
import {
  AdminLayout,
  AdminDashboard,
  AdminOrders,
  AdminProducts,
  AdminCategories,
  AdminAbandonedCarts,
  AdminBanners,
  AdminLoginPage,
} from "./pages/admin";
import AdminTracking from "./pages/admin/AdminTracking";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminPix from "./pages/admin/AdminPix";
import AdminWhatsApp from "./pages/admin/AdminWhatsApp";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/produto/:id" element={<ProductPage />} />
            <Route path="/categoria/:slug" element={<CategoryPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/pedido" element={<OrderStatusPage />} />
            <Route path="/rastreio" element={<TrackingPage />} />
            <Route path="/busca" element={<SearchPage />} />
            <Route path="/sobre" element={<AboutPage />} />
            <Route path="/contato" element={<ContactPage />} />
            <Route path="/politica-privacidade" element={<PrivacyPage />} />
            <Route path="/termos-uso" element={<TermsPage />} />
            <Route path="/trocas-devolucoes" element={<ExchangesPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="pedidos" element={<AdminOrders />} />
              <Route path="produtos" element={<AdminProducts />} />
              <Route path="categorias" element={<AdminCategories />} />
              <Route path="banners" element={<AdminBanners />} />
              <Route path="rastreios" element={<AdminTracking />} />
              <Route path="avaliacoes" element={<AdminReviews />} />
              <Route path="pix" element={<AdminPix />} />
              <Route path="carrinhos-abandonados" element={<AdminAbandonedCarts />} />
              <Route path="whatsapp" element={<AdminWhatsApp />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;