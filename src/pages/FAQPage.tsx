import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqItems = [
  {
    question: 'Qual o prazo de entrega?',
    answer: 'O prazo de entrega varia de acordo com a sua região. Em geral, para capitais e grandes centros, o prazo é de 3 a 7 dias úteis. Para demais regiões, pode variar de 7 a 15 dias úteis. Após o envio, você receberá o código de rastreamento por e-mail.',
  },
  {
    question: 'Como funciona o frete grátis?',
    answer: 'Oferecemos frete grátis para compras acima de R$ 299,00 para todo o Brasil. Para compras abaixo desse valor, o frete é calculado com base no CEP de destino e no peso dos produtos.',
  },
  {
    question: 'Posso parcelar minha compra?',
    answer: 'Sim! Parcelamos em até 12x sem juros no cartão de crédito. O valor mínimo por parcela é de R$ 50,00. Também aceitamos pagamento à vista via PIX com 5% de desconto.',
  },
  {
    question: 'Os produtos têm garantia?',
    answer: 'Todos os produtos possuem garantia do fabricante de 12 meses, além da garantia legal de 90 dias estabelecida pelo Código de Defesa do Consumidor. Para acionar a garantia, entre em contato com nosso suporte.',
  },
  {
    question: 'Como faço para trocar ou devolver um produto?',
    answer: 'Você tem 7 dias corridos após o recebimento para solicitar a troca ou devolução. O produto deve estar em perfeitas condições, na embalagem original e com todos os acessórios. Entre em contato pelo nosso canal de atendimento para iniciar o processo.',
  },
  {
    question: 'Vocês emitem nota fiscal?',
    answer: 'Sim, emitimos nota fiscal eletrônica (NF-e) para todos os pedidos. A nota é enviada automaticamente para o e-mail cadastrado no momento da compra.',
  },
  {
    question: 'Os produtos são originais?',
    answer: 'Sim, todos os nossos produtos são 100% originais e adquiridos diretamente dos fabricantes ou distribuidores autorizados. Não trabalhamos com produtos paralelos ou réplicas.',
  },
  {
    question: 'Como acompanho meu pedido?',
    answer: 'Após a confirmação do pagamento e envio do pedido, você receberá um e-mail com o código de rastreamento. Você também pode acompanhar seu pedido na página "Rastrear Pedido" usando o número do pedido.',
  },
  {
    question: 'Vocês possuem loja física?',
    answer: 'Atualmente operamos apenas como loja virtual, o que nos permite oferecer preços mais competitivos. Nosso showroom em São Paulo está disponível para visitas agendadas.',
  },
  {
    question: 'Como entro em contato com o suporte?',
    answer: 'Você pode entrar em contato conosco pelo WhatsApp (11) 99999-9999, pelo e-mail contato@cameraefoto.com.br ou através do formulário na página de Contato. Nosso horário de atendimento é de segunda a sexta, das 9h às 18h.',
  },
];

const FAQPage = () => {
  return (
    <MainLayout>
      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary">Início</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Perguntas Frequentes</span>
        </nav>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Perguntas Frequentes</h1>
          <p className="text-muted-foreground text-center mb-12">
            Encontre respostas para as dúvidas mais comuns sobre nossa loja, produtos e serviços.
          </p>

          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                <AccordionTrigger className="text-left hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center p-6 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Não encontrou o que procurava?</h3>
            <p className="text-muted-foreground mb-4">
              Entre em contato conosco que teremos prazer em ajudar.
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

export default FAQPage;
