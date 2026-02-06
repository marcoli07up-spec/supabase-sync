import { MainLayout } from '@/components/layout/MainLayout';
import { HeroBanner } from '@/components/home/HeroBanner';
import { CategorySection } from '@/components/home/CategorySection';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';

const Index = () => {
  return (
    <MainLayout>
      <HeroBanner />
      <CategorySection />
      <FeaturedProducts />
      
      {/* Newsletter Section */}
      <section className="py-12 bg-primary text-primary-foreground">
        <div className="container-custom text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Receba nossas ofertas exclusivas
          </h2>
          <p className="mb-6 opacity-90">
            Cadastre-se e receba promoções e novidades em primeira mão
          </p>
          <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Seu melhor e-mail"
              className="flex-1 px-4 py-3 rounded-lg text-foreground bg-background"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/90 transition-colors"
            >
              Cadastrar
            </button>
          </form>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
