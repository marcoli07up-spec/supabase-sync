import { Link } from 'react-router-dom';
import { ChevronRight, RotateCcw, Package, Truck, AlertCircle } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';

const ReturnsPage = () => {
  return (
    <MainLayout>
      <div className="container-custom py-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary">Início</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Trocas e Devoluções</span>
        </nav>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Trocas e Devoluções</h1>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            <div className="text-center p-6 bg-card border rounded-lg">
              <RotateCcw className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">7 Dias</h3>
              <p className="text-sm text-muted-foreground">Para arrependimento</p>
            </div>
            <div className="text-center p-6 bg-card border rounded-lg">
              <Package className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Embalagem Original</h3>
              <p className="text-sm text-muted-foreground">Produto sem uso</p>
            </div>
            <div className="text-center p-6 bg-card border rounded-lg">
              <Truck className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Frete Grátis</h3>
              <p className="text-sm text-muted-foreground">Na primeira troca</p>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2>Direito de Arrependimento</h2>
            <p>
              De acordo com o Código de Defesa do Consumidor (Art. 49), você tem até 7 (sete) dias 
              corridos após o recebimento do produto para solicitar a devolução por arrependimento.
            </p>

            <h2>Condições para Troca ou Devolução</h2>
            <ul>
              <li>O produto deve estar em perfeitas condições, sem sinais de uso</li>
              <li>Deve estar na embalagem original, com todos os acessórios e manuais</li>
              <li>A nota fiscal deve acompanhar o produto</li>
              <li>O lacre, quando houver, deve estar intacto</li>
            </ul>

            <h2>Como Solicitar</h2>
            <ol>
              <li>Entre em contato com nosso suporte pelo e-mail trocas@cameraefoto.com.br ou WhatsApp</li>
              <li>Informe o número do pedido e o motivo da solicitação</li>
              <li>Aguarde a autorização e instruções de envio</li>
              <li>Embale o produto de forma segura e envie para o endereço indicado</li>
              <li>Após análise, o reembolso ou troca será processado</li>
            </ol>

            <h2>Prazo para Reembolso</h2>
            <p>
              Após o recebimento e análise do produto devolvido, o reembolso será processado em até 
              10 dias úteis, utilizando o mesmo meio de pagamento da compra original.
            </p>

            <h2>Produtos com Defeito</h2>
            <p>
              Se o produto apresentar defeito de fabricação, você pode solicitar a troca dentro do 
              prazo de garantia (12 meses). Nestes casos, o frete de envio é por nossa conta.
            </p>

            <div className="not-prose bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800 dark:text-amber-200">Atenção</p>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Produtos danificados por mau uso, quedas ou exposição a condições inadequadas 
                  não são elegíveis para troca ou devolução.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center p-6 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Precisa de ajuda?</h3>
            <p className="text-muted-foreground mb-4">
              Nossa equipe está pronta para ajudar com sua solicitação.
            </p>
            <Link to="/contato" className="text-primary hover:underline font-medium">
              Falar com o suporte →
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ReturnsPage;
