import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';

const TermsOfUsePage = () => {
  return (
    <MainLayout>
      <div className="container-custom py-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary">Início</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Termos de Uso</span>
        </nav>

        <div className="max-w-3xl mx-auto prose prose-lg">
          <h1>Termos de Uso</h1>
          <p className="text-muted-foreground">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

          <h2>1. Aceitação dos Termos</h2>
          <p>
            Ao acessar e usar o site Câmera & Foto, você concorda com estes termos de uso. 
            Se não concordar com qualquer parte destes termos, não utilize nosso site.
          </p>

          <h2>2. Uso do Site</h2>
          <p>Você concorda em usar o site apenas para fins legais e de acordo com estes termos. É proibido:</p>
          <ul>
            <li>Violar leis ou regulamentos aplicáveis</li>
            <li>Interferir no funcionamento do site</li>
            <li>Tentar acessar áreas restritas sem autorização</li>
            <li>Usar o site para fins fraudulentos</li>
          </ul>

          <h2>3. Conta de Usuário</h2>
          <p>
            Você é responsável por manter a confidencialidade de suas credenciais de acesso 
            e por todas as atividades realizadas em sua conta.
          </p>

          <h2>4. Produtos e Preços</h2>
          <p>
            Nos esforçamos para manter as informações dos produtos atualizadas, mas não garantimos 
            que todas as descrições, imagens ou preços estejam livres de erros. Reservamo-nos o direito 
            de corrigir erros e atualizar informações a qualquer momento.
          </p>

          <h2>5. Pedidos e Pagamentos</h2>
          <p>
            Todos os pedidos estão sujeitos à disponibilidade e confirmação do pagamento. 
            Reservamo-nos o direito de recusar ou cancelar pedidos em caso de suspeita de fraude.
          </p>

          <h2>6. Propriedade Intelectual</h2>
          <p>
            Todo o conteúdo do site, incluindo textos, imagens, logotipos e design, é de propriedade 
            da Câmera & Foto ou licenciado para uso. É proibida a reprodução sem autorização.
          </p>

          <h2>7. Limitação de Responsabilidade</h2>
          <p>
            Não nos responsabilizamos por danos indiretos, incidentais ou consequenciais decorrentes 
            do uso do site ou da impossibilidade de usá-lo.
          </p>

          <h2>8. Modificações</h2>
          <p>
            Podemos modificar estes termos a qualquer momento. As alterações entram em vigor 
            imediatamente após a publicação no site.
          </p>

          <h2>9. Lei Aplicável</h2>
          <p>
            Estes termos são regidos pelas leis brasileiras. Qualquer disputa será resolvida 
            no foro da comarca de São Paulo - SP.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default TermsOfUsePage;
