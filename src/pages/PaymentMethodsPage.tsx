import { Link } from 'react-router-dom';
import { ChevronRight, CreditCard, QrCode, Banknote, Wallet } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';

const PaymentMethodsPage = () => {
  return (
    <MainLayout>
      <div className="container-custom py-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary">Início</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Formas de Pagamento</span>
        </nav>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Formas de Pagamento</h1>

          <div className="space-y-8">
            {/* PIX */}
            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 bg-success/10 text-success rounded-lg flex items-center justify-center">
                  <QrCode className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">PIX</h2>
                  <p className="text-success font-medium">5% de desconto</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                Pagamento instantâneo com aprovação em segundos. Basta copiar o código PIX gerado 
                e colar no aplicativo do seu banco. O pedido é processado imediatamente após a confirmação.
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span> Desconto de 5% no valor total
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span> Confirmação instantânea
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span> Disponível 24 horas
                </li>
              </ul>
            </div>

            {/* Cartão de Crédito */}
            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Cartão de Crédito</h2>
                  <p className="text-primary font-medium">Até 12x sem juros</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                Parcelamos em até 12 vezes sem juros no cartão de crédito. Aceitamos as principais 
                bandeiras do mercado com toda segurança.
              </p>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {['Visa', 'Mastercard', 'Elo', 'Hipercard', 'American Express'].map((brand) => (
                  <span key={brand} className="px-3 py-1 bg-muted rounded text-sm">
                    {brand}
                  </span>
                ))}
              </div>

              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span> Parcelamento em até 12x sem juros
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span> Parcela mínima de R$ 50,00
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span> Ambiente 100% seguro
                </li>
              </ul>
            </div>

            {/* Boleto */}
            <div className="bg-card border rounded-lg p-6 opacity-60">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 bg-muted text-muted-foreground rounded-lg flex items-center justify-center">
                  <Banknote className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Boleto Bancário</h2>
                  <p className="text-muted-foreground font-medium">Em breve</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                Estamos trabalhando para disponibilizar o pagamento via boleto bancário em breve.
              </p>
            </div>
          </div>

          {/* Security Badge */}
          <div className="mt-12 text-center p-6 bg-primary/5 rounded-lg">
            <Wallet className="h-10 w-10 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Compra 100% Segura</h3>
            <p className="text-muted-foreground text-sm">
              Todas as transações são protegidas com criptografia SSL. Seus dados estão seguros conosco.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PaymentMethodsPage;
