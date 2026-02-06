import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  CreditCard,
  Shield,
  Truck
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      {/* Features bar */}
      <div className="border-b border-muted-foreground/20">
        <div className="container-custom py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-4">
              <Truck className="h-10 w-10 text-primary" />
              <div>
                <h4 className="font-semibold">Frete Grátis</h4>
                <p className="text-sm text-muted-foreground">Para compras acima de R$ 299</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Shield className="h-10 w-10 text-primary" />
              <div>
                <h4 className="font-semibold">Compra Segura</h4>
                <p className="text-sm text-muted-foreground">Site 100% seguro</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <CreditCard className="h-10 w-10 text-primary" />
              <div>
                <h4 className="font-semibold">Pagamento Facilitado</h4>
                <p className="text-sm text-muted-foreground">Em até 12x sem juros</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="h-10 w-10 text-primary" />
              <div>
                <h4 className="font-semibold">Suporte</h4>
                <p className="text-sm text-muted-foreground">Atendimento especializado</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary text-primary-foreground font-bold text-xl px-3 py-1 rounded">
                CF
              </div>
              <span className="text-lg font-semibold">Câmera & Foto</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Sua loja especializada em equipamentos fotográficos. Trabalhamos com as melhores
              marcas do mercado para oferecer produtos de qualidade.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Institucional</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/sobre" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contato
                </Link>
              </li>
              <li>
                <Link to="/politica-privacidade" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link to="/termos-uso" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link to="/trocas-devolucoes" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Trocas e Devoluções
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-semibold mb-4">Ajuda</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Perguntas Frequentes
                </Link>
              </li>
              <li>
                <Link to="/rastreio" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Rastrear Pedido
                </Link>
              </li>
              <li>
                <Link to="/formas-pagamento" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Formas de Pagamento
                </Link>
              </li>
              <li>
                <Link to="/frete-entrega" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Frete e Entrega
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  Av. Paulista, 1000 - Bela Vista, São Paulo - SP, 01310-100
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <a href="tel:+5511999999999" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  (11) 99999-9999
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <a href="mailto:contato@cameraefoto.com.br" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  contato@cameraefoto.com.br
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-muted-foreground/20">
        <div className="container-custom py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              © {new Date().getFullYear()} Câmera & Foto. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-2">
              <img src="https://cdn.jsdelivr.net/gh/lipis/flag-icons@6.6.6/flags/4x3/br.svg" alt="Brasil" className="h-4" />
              <span className="text-sm text-muted-foreground">Brasil</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
