import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';

const PrivacyPolicyPage = () => {
  return (
    <MainLayout>
      <div className="container-custom py-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary">Início</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Política de Privacidade</span>
        </nav>

        <div className="max-w-3xl mx-auto prose prose-lg">
          <h1>Política de Privacidade</h1>
          <p className="text-muted-foreground">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

          <h2>1. Informações que Coletamos</h2>
          <p>
            Coletamos informações que você nos fornece diretamente, como nome, e-mail, telefone, 
            endereço de entrega e dados de pagamento quando você realiza uma compra em nossa loja.
          </p>

          <h2>2. Como Usamos suas Informações</h2>
          <p>Utilizamos suas informações para:</p>
          <ul>
            <li>Processar e entregar seus pedidos</li>
            <li>Enviar confirmações e atualizações sobre seus pedidos</li>
            <li>Responder suas dúvidas e solicitações</li>
            <li>Enviar ofertas e promoções (com seu consentimento)</li>
            <li>Melhorar nossos produtos e serviços</li>
          </ul>

          <h2>3. Compartilhamento de Dados</h2>
          <p>
            Não vendemos suas informações pessoais. Compartilhamos dados apenas com:
          </p>
          <ul>
            <li>Transportadoras para entrega dos pedidos</li>
            <li>Processadores de pagamento para transações financeiras</li>
            <li>Autoridades quando exigido por lei</li>
          </ul>

          <h2>4. Segurança</h2>
          <p>
            Implementamos medidas de segurança técnicas e organizacionais para proteger suas 
            informações contra acesso não autorizado, alteração, divulgação ou destruição.
          </p>

          <h2>5. Seus Direitos</h2>
          <p>Você tem direito a:</p>
          <ul>
            <li>Acessar seus dados pessoais</li>
            <li>Corrigir informações incorretas</li>
            <li>Solicitar a exclusão dos seus dados</li>
            <li>Revogar consentimentos dados anteriormente</li>
          </ul>

          <h2>6. Cookies</h2>
          <p>
            Utilizamos cookies para melhorar sua experiência de navegação, lembrar suas preferências 
            e analisar o tráfego do site. Você pode configurar seu navegador para recusar cookies.
          </p>

          <h2>7. Contato</h2>
          <p>
            Para exercer seus direitos ou tirar dúvidas sobre esta política, entre em contato pelo 
            e-mail: privacidade@cameraefoto.com.br
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default PrivacyPolicyPage;
