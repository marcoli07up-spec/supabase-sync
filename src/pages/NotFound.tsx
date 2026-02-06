import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout';

const NotFound = () => {
  return (
    <Layout>
      <div className="container-custom py-24 text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Página não encontrada</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Link to="/">
          <Button size="lg">
            <Home className="h-4 w-4 mr-2" />
            Voltar para a loja
          </Button>
        </Link>
      </div>
    </Layout>
  );
};

export default NotFound;
