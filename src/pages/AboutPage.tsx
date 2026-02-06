import { Link } from 'react-router-dom';
import { ChevronRight, Users, Award, Heart, Target } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';

const AboutPage = () => {
  return (
    <MainLayout>
      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary">Início</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Sobre Nós</span>
        </nav>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Sobre a Câmera & Foto</h1>

          {/* Hero Image */}
          <div className="relative aspect-video rounded-lg overflow-hidden mb-12">
            <img
              src="https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=1200&q=80"
              alt="Equipe Câmera & Foto"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none mb-12">
            <p>
              A <strong>Câmera & Foto</strong> nasceu em 2015 com uma missão clara: democratizar o acesso a equipamentos 
              fotográficos de qualidade no Brasil. Somos apaixonados por fotografia e acreditamos que cada momento 
              merece ser capturado com a melhor qualidade possível.
            </p>
            <p>
              Nossa equipe é formada por fotógrafos profissionais, videomakers e entusiastas que entendem as 
              necessidades de quem busca o equipamento perfeito. Oferecemos desde câmeras para iniciantes até 
              equipamentos profissionais de última geração.
            </p>
            <p>
              Trabalhamos diretamente com as principais marcas do mercado como Canon, Nikon, Sony, Fujifilm 
              e muitas outras, garantindo produtos originais com garantia e suporte técnico especializado.
            </p>
          </div>

          {/* Values */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="text-center p-6 bg-card border rounded-lg">
              <Users className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">+50.000</h3>
              <p className="text-sm text-muted-foreground">Clientes Satisfeitos</p>
            </div>
            <div className="text-center p-6 bg-card border rounded-lg">
              <Award className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">+10 Anos</h3>
              <p className="text-sm text-muted-foreground">de Experiência</p>
            </div>
            <div className="text-center p-6 bg-card border rounded-lg">
              <Heart className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Qualidade</h3>
              <p className="text-sm text-muted-foreground">Produtos Originais</p>
            </div>
            <div className="text-center p-6 bg-card border rounded-lg">
              <Target className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Suporte</h3>
              <p className="text-sm text-muted-foreground">Atendimento Especializado</p>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-primary/5 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Nossa Missão</h2>
              <p className="text-muted-foreground">
                Proporcionar aos nossos clientes a melhor experiência de compra em equipamentos fotográficos, 
                oferecendo produtos de qualidade, preços justos e atendimento excepcional.
              </p>
            </div>
            <div className="p-6 bg-primary/5 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Nossa Visão</h2>
              <p className="text-muted-foreground">
                Ser a principal referência em e-commerce de equipamentos fotográficos no Brasil, reconhecida 
                pela excelência em produtos, serviços e relacionamento com o cliente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AboutPage;
