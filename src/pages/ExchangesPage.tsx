import { RefreshCw, Package, Clock, CheckCircle } from 'lucide-react';
import { Layout } from '@/components/layout';

export default function ExchangesPage() {
  return (
    <Layout>
      <div className="container-custom py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-center">Trocas e Devoluções</h1>
          <p className="text-muted-foreground text-center mb-12">
            Sua satisfação é nossa prioridade
          </p>

          {/* Highlights */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-card p-6 rounded-lg border border-border text-center">
              <RefreshCw className="h-10 w-10 text-primary mx-auto mb-3" />
              <h3 className="font-semibold">90 Dias</h3>
              <p className="text-sm text-muted-foreground">Para trocas e devoluções</p>
            </div>
            <div className="bg-card p-6 rounded-lg border border-border text-center">
              <Package className="h-10 w-10 text-primary mx-auto mb-3" />
              <h3 className="font-semibold">Frete Grátis</h3>
              <p className="text-sm text-muted-foreground">Na primeira troca</p>
            </div>
            <div className="bg-card p-6 rounded-lg border border-border text-center">
              <Clock className="h-10 w-10 text-primary mx-auto mb-3" />
              <h3 className="font-semibold">7 Dias</h3>
              <p className="text-sm text-muted-foreground">Para reembolso total</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <h2>Política de Trocas</h2>
            <p>
              Você tem até <strong>90 dias</strong> após o recebimento do produto para 
              solicitar uma troca. O produto deve estar em perfeitas condições, sem sinais 
              de uso e na embalagem original.
            </p>

            <h3>Como solicitar uma troca:</h3>
            <ol>
              <li>Entre em contato pelo WhatsApp ou email informando o número do pedido</li>
              <li>Informe o motivo da troca e o produto desejado</li>
              <li>Aguarde as instruções de envio</li>
              <li>Envie o produto na embalagem original</li>
              <li>Após recebermos e verificarmos o produto, enviaremos o novo item</li>
            </ol>

            <h2>Política de Devoluções</h2>
            <p>
              Se você não estiver satisfeito com sua compra, pode solicitar a devolução 
              em até <strong>7 dias</strong> após o recebimento para reembolso total, 
              conforme o Código de Defesa do Consumidor.
            </p>

            <h3>Condições para devolução:</h3>
            <ul>
              <li>Produto sem sinais de uso</li>
              <li>Embalagem original intacta</li>
              <li>Todos os acessórios inclusos</li>
              <li>Nota fiscal de compra</li>
            </ul>

            <h3>Reembolso:</h3>
            <p>
              O reembolso será processado em até 5 dias úteis após recebermos e 
              verificarmos o produto. O valor será devolvido através do mesmo método 
              de pagamento utilizado na compra.
            </p>

            <h2>Produtos com Defeito</h2>
            <p>
              Se o produto apresentar defeito de fabricação, você tem até 
              <strong> 1 ano de garantia</strong>. Entre em contato conosco e 
              providenciaremos a troca ou reparo sem custo adicional.
            </p>

            <h2>Contato</h2>
            <p>
              Para solicitar troca ou devolução, entre em contato:
            </p>
            <ul>
              <li>WhatsApp: (44) 3101-1011</li>
              <li>Email: contato@camerasprime.com.br</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}