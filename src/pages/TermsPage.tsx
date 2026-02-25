import { Layout } from '@/components/layout';

export default function TermsPage() {
  return (
    <Layout>
      <div className="container-custom py-12">
        <div className="max-w-3xl mx-auto prose prose-invert">
          <h1>Termos de Uso</h1>
          <p className="text-muted-foreground">Última atualização: Janeiro de 2024</p>

          <h2>1. Aceitação dos Termos</h2>
          <p>
            Ao acessar e usar o site iCamStore, você concorda em cumprir estes 
            termos de uso. Se você não concordar com qualquer parte destes termos, 
            não deve usar nosso site.
          </p>

          <h2>2. Uso do Site</h2>
          <p>Ao usar nosso site, você concorda em:</p>
          <ul>
            <li>Fornecer informações precisas e verdadeiras</li>
            <li>Não usar o site para fins ilegais</li>
            <li>Não tentar acessar áreas restritas do site</li>
            <li>Não reproduzir ou copiar conteúdo sem autorização</li>
          </ul>

          <h2>3. Produtos e Preços</h2>
          <p>
            Nos esforçamos para exibir informações precisas sobre nossos produtos, 
            incluindo preços e disponibilidade. No entanto, erros podem ocorrer. 
            Reservamo-nos o direito de corrigir erros e atualizar informações a 
            qualquer momento.
          </p>

          <h2>4. Pedidos e Pagamentos</h2>
          <p>
            Ao fazer um pedido, você está fazendo uma oferta para comprar o produto. 
            A confirmação do pedido será enviada por email. O contrato de venda é 
            estabelecido quando o pagamento é processado com sucesso.
          </p>

          <h2>5. Entrega</h2>
          <p>
            Oferecemos frete grátis para todo o Brasil. Os prazos de entrega podem 
            variar de acordo com a região. O rastreamento estará disponível após 
            o envio do produto.
          </p>

          <h2>6. Propriedade Intelectual</h2>
          <p>
            Todo o conteúdo do site, incluindo textos, imagens, logotipos e design, 
            é propriedade da iCamStore ou de seus licenciadores e está protegido 
            por leis de direitos autorais.
          </p>

          <h2>7. Limitação de Responsabilidade</h2>
          <p>
            A iCamStore não se responsabiliza por danos indiretos, incidentais 
            ou consequentes decorrentes do uso do site ou da incapacidade de usá-lo.
          </p>

          <h2>8. Alterações nos Termos</h2>
          <p>
            Podemos atualizar estes termos periodicamente. As alterações entrarão 
            em vigor imediatamente após a publicação no site.
          </p>

          <h2>9. Contato</h2>
          <p>
            Para dúvidas sobre estes termos, entre em contato através do email: 
            contato@icamstore.com.br
          </p>
        </div>
      </div>
    </Layout>
  );
}
