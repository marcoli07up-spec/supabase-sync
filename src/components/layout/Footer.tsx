import { Link } from 'react-router-dom';
import { Mail, MapPin } from 'lucide-react';

export function Footer() {
  const logoUrl = "https://i.ibb.co/CpmLv0N9/490471327-1074848954471870-8936448961432822653-n-Editado.png";

  return (
    <footer className="bg-secondary border-t border-border">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <img src={logoUrl} alt="Câmeras Prime" className="h-10" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Paixão por imagem e compromisso com confiança. Somos uma loja especializada em câmeras e equipamentos fotográficos seminovos.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Categorias</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/categoria/cameras" className="text-muted-foreground hover:text-primary transition-colors">Câmeras</Link></li>
              <li><Link to="/categoria/lentes" className="text-muted-foreground hover:text-primary transition-colors">Lentes</Link></li>
              <li><Link to="/categoria/audio" className="text-muted-foreground hover:text-primary transition-colors">Áudio</Link></li>
              <li><Link to="/categoria/mochilas" className="text-muted-foreground hover:text-primary transition-colors">Mochilas</Link></li>
              <li><Link to="/categoria/iluminacao" className="text-muted-foreground hover:text-primary transition-colors">Iluminação</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Institucional</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/sobre" className="text-muted-foreground hover:text-primary transition-colors">Sobre Nós</Link></li>
              <li><Link to="/contato" className="text-muted-foreground hover:text-primary transition-colors">Contato</Link></li>
              <li><Link to="/rastreio" className="text-muted-foreground hover:text-primary transition-colors">Rastrear Pedido</Link></li>
              <li><Link to="/politica-privacidade" className="text-muted-foreground hover:text-primary transition-colors">Política de Privacidade</Link></li>
              <li><Link to="/termos-uso" className="text-muted-foreground hover:text-primary transition-colors">Termos de Uso</Link></li>
              <li><Link to="/trocas-devolucoes" className="text-muted-foreground hover:text-primary transition-colors">Trocas e Devoluções</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Contato</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 mt-0.5 text-primary" />
                <span>contato@icamstore.com.br</span>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 text-primary" />
                <span>Av. Brasil, 284 - Zona 05, Maringá - PR</span>
              </li>
            </ul>
            <div className="mt-6 p-4 bg-background rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">Horário de Atendimento:</strong><br />
                Seg a Sex: 9h às 18h<br />
                Sábado: 9h às 13h
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-custom py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>© 2024 Câmeras Prime. Todos os direitos reservados.</p>
            <div className="flex items-center gap-4">
              <span>Pagamento seguro</span>
              <div className="flex gap-2">
                <div className="bg-background px-2 py-1 rounded text-xs font-medium">PIX</div>
                <div className="bg-background px-2 py-1 rounded text-xs font-medium">Visa</div>
                <div className="bg-background px-2 py-1 rounded text-xs font-medium">Mastercard</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}