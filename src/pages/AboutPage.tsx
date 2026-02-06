import { Link } from 'react-router-dom';
import { Camera, Truck, Shield, Award, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout';

export default function AboutPage() {
  return (
    <Layout>
      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="bg-primary p-3 rounded-xl">
                <Camera className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Sobre a Câmera & Foto</h1>
            <p className="text-lg text-muted-foreground">
              Paixão por imagem e compromisso com confiança desde 2018
            </p>
          </div>

          {/* Story */}
          <div className="prose prose-invert max-w-none mb-12">
            <p className="text-lg leading-relaxed">
              Somos uma loja especializada em <strong>câmeras e equipamentos fotográficos</strong>, 
              com <strong>loja física</strong>, atendimento especializado e envio para todo o Brasil. 
              Trabalhamos com produtos novos e seminovos revisados, <strong>nota fiscal</strong>, 
              <strong> rastreio</strong> e <strong>1 ano de garantia</strong> para sua total tranquilidade.
            </p>
            <p className="text-lg leading-relaxed">
              Nossa equipe é formada por profissionais apaixonados por fotografia e vídeo, 
              prontos para ajudar você a escolher o equipamento perfeito para suas necessidades, 
              seja você um iniciante ou um profissional experiente.
            </p>
          </div>

          {/* Values */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-card p-6 rounded-lg border border-border">
              <Truck className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Frete Grátis</h3>
              <p className="text-muted-foreground">
                Envio rápido e gratuito com código de rastreio via Correios para todo o Brasil.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border border-border">
              <Shield className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Satisfação Garantida</h3>
              <p className="text-muted-foreground">
                Caso você não fique satisfeito, devolvemos o seu dinheiro em até 7 dias.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border border-border">
              <Users className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Suporte Profissional</h3>
              <p className="text-muted-foreground">
                Equipe de suporte especializada para te atender todos os dias da semana.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border border-border">
              <Award className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Garantia Estendida</h3>
              <p className="text-muted-foreground">
                Todos os produtos possuem 1 ano de garantia total para sua segurança.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link to="/">
              <Button size="lg">
                Ver Nossos Produtos
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
