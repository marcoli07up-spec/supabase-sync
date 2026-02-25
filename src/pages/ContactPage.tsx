import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Layout } from '@/components/layout';
import { toast } from 'sonner';
import { useWhatsAppSettings } from '@/hooks/useWhatsAppSettings';

export default function ContactPage() {
  const { data: whatsapp } = useWhatsAppSettings();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Mensagem enviada com sucesso! Entraremos em contato em breve.');
  };

  return (
    <Layout>
      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-center">Fale Conosco</h1>
          <p className="text-muted-foreground text-center mb-12">
            Estamos aqui para ajudar! Entre em contato conosco.
          </p>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact info */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Informações de Contato</h2>
              
              <div className="flex items-start gap-4">
                <Phone className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <p className="font-medium">Telefone / WhatsApp</p>
                  <p className="text-muted-foreground">(44) 3101-1011</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-muted-foreground">contato@camerasprime.com.br</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <p className="font-medium">Endereço</p>
                  <p className="text-muted-foreground">Av. Brasil, 284 - Zona 05, Maringá - PR</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <p className="font-medium">Horário de Atendimento</p>
                  <p className="text-muted-foreground">
                    Seg a Sex: 9h às 18h<br />
                    Sábado: 9h às 13h
                  </p>
                </div>
              </div>

              {whatsapp?.enabled && (
                <Button className="w-full" size="lg" onClick={() => {
                  const phone = whatsapp.phone || '554431011011';
                  window.open(`https://wa.me/${phone}`, '_blank');
                }}>
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Chamar no WhatsApp
                </Button>
              )}
            </div>

            {/* Contact form */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <h2 className="text-xl font-semibold mb-4">Envie uma Mensagem</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" placeholder="Seu nome" required />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="seu@email.com" required />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" placeholder="(44) 99999-9999" />
                </div>
                <div>
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea id="message" placeholder="Como podemos ajudar?" rows={4} required />
                </div>
                <Button type="submit" className="w-full">
                  Enviar Mensagem
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}