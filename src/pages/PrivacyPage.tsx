import { Layout } from '@/components/layout';

export default function PrivacyPage() {
  return (
    <Layout>
      <div className="container-custom py-12">
        <div className="max-w-3xl mx-auto prose prose-invert">
          <h1>Política de Privacidade</h1>
          <p className="text-muted-foreground">Última atualização: Janeiro de 2024</p>

          <h2>1. Informações que Coletamos</h2>
          <p>
            Coletamos informações que você nos fornece diretamente ao realizar uma compra, 
            criar uma conta ou entrar em contato conosco. Essas informações incluem:
          </p>
          <ul>
            <li>Nome completo</li>
            <li>Endereço de email</li>
            <li>Número de telefone</li>
            <li>Endereço de entrega</li>
            <li>Informações de pagamento</li>
          </ul>

          <h2>2. Como Usamos suas Informações</h2>
          <p>Utilizamos suas informações para:</p>
          <ul>
            <li>Processar e entregar seus pedidos</li>
            <li>Enviar atualizações sobre seu pedido</li>
            <li>Responder suas dúvidas e solicitações</li>
            <li>Melhorar nossos produtos e serviços</li>
            <li>Enviar comunicações de marketing (com seu consentimento)</li>
          </ul>

          <h2>3. Compartilhamento de Informações</h2>
          <p>
            Não vendemos suas informações pessoais. Compartilhamos dados apenas com:
          </p>
          <ul>
            <li>Parceiros de logística para entrega dos produtos</li>
            <li>Processadores de pagamento para transações seguras</li>
            <li>Quando exigido por lei</li>
          </ul>

          <h2>4. Segurança</h2>
          <p>
            Implementamos medidas de segurança técnicas e organizacionais para proteger 
            suas informações pessoais contra acesso não autorizado, alteração, divulgação 
            ou destruição.
          </p>

          <h2>5. Seus Direitos</h2>
          <p>Você tem o direito de:</p>
          <ul>
            <li>Acessar seus dados pessoais</li>
            <li>Corrigir dados incorretos</li>
            <li>Solicitar a exclusão de seus dados</li>
            <li>Revogar consentimento para marketing</li>
          </ul>

          <h2>6. Cookies</h2>
          <p>
            Utilizamos cookies para melhorar sua experiência de navegação, analisar o 
            tráfego do site e personalizar conteúdo. Você pode gerenciar suas preferências 
            de cookies nas configurações do seu navegador.
          </p>

          <h2>7. Contato</h2>
          <p>
            Para questões sobre esta política ou sobre seus dados pessoais, entre em 
            contato através do email: contato@icamstore.com.br
          </p>
        </div>
      </div>
    </Layout>
  );
}
