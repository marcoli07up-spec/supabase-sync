import { Link } from 'react-router-dom';
import { ChevronRight, Truck, Package, Clock, MapPin } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';

const ShippingPage = () => {
  return (
    <MainLayout>
      <div className="container-custom py-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary">Início</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Frete e Entrega</span>
        </nav>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Frete e Entrega</h1>

          {/* Free Shipping Banner */}
          <div className="bg-success/10 border border-success/20 rounded-lg p-6 mb-8 text-center">
            <Truck className="h-12 w-12 text-success mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-success mb-2">Frete Grátis</h2>
            <p className="text-muted-foreground">
              Para compras acima de <strong>R$ 299,00</strong> para todo o Brasil!
            </p>
          </div>

          {/* Shipping Info */}
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            <div className="text-center p-6 bg-card border rounded-lg">
              <Clock className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Capitais</h3>
              <p className="text-sm text-muted-foreground">3 a 7 dias úteis</p>
            </div>
            <div className="text-center p-6 bg-card border rounded-lg">
              <Package className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Demais Regiões</h3>
              <p className="text-sm text-muted-foreground">7 a 15 dias úteis</p>
            </div>
            <div className="text-center p-6 bg-card border rounded-lg">
              <MapPin className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Todo Brasil</h3>
              <p className="text-sm text-muted-foreground">Entregamos em todo país</p>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2>Como Funciona</h2>
            <p>
              Trabalhamos com os melhores parceiros de logística para garantir que seu pedido 
              chegue com segurança e no menor tempo possível.
            </p>

            <h2>Cálculo do Frete</h2>
            <p>
              O valor do frete é calculado automaticamente durante o checkout, baseado no CEP 
              de destino e no peso/dimensões dos produtos. Você visualiza o valor antes de 
              finalizar a compra.
            </p>

            <h2>Rastreamento</h2>
            <p>
              Após o envio do pedido, você receberá um e-mail com o código de rastreamento. 
              Você também pode acompanhar seu pedido na página "Rastrear Pedido" do nosso site.
            </p>

            <h2>Prazo de Entrega</h2>
            <ul>
              <li><strong>Capitais e regiões metropolitanas:</strong> 3 a 7 dias úteis</li>
              <li><strong>Interior:</strong> 5 a 10 dias úteis</li>
              <li><strong>Áreas remotas:</strong> 10 a 15 dias úteis</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              * Os prazos são contados a partir da confirmação do pagamento e podem variar 
              em períodos de alta demanda (Black Friday, Natal, etc.)
            </p>

            <h2>Recebimento</h2>
            <p>
              Ao receber seu pedido, verifique se a embalagem está intacta antes de assinar 
              o comprovante de entrega. Em caso de avarias externas, recuse o recebimento 
              e entre em contato conosco imediatamente.
            </p>

            <h2>Dúvidas Frequentes</h2>
            <h3>E se eu não estiver em casa?</h3>
            <p>
              A transportadora fará até 3 tentativas de entrega. Após isso, o pedido ficará 
              disponível para retirada na agência mais próxima por até 7 dias.
            </p>

            <h3>Posso alterar o endereço após a compra?</h3>
            <p>
              Alterações de endereço podem ser solicitadas antes do envio. Após a postagem, 
              não é possível alterar o endereço de entrega.
            </p>
          </div>

          <div className="mt-12 text-center p-6 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Precisa rastrear seu pedido?</h3>
            <p className="text-muted-foreground mb-4">
              Acompanhe a entrega em tempo real.
            </p>
            <Link to="/rastreio" className="text-primary hover:underline font-medium">
              Rastrear Pedido →
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ShippingPage;
