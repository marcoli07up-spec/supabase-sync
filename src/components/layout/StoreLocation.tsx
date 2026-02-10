import { Instagram, MapPin } from 'lucide-react';
import storeFrontImg from '@/assets/store-front.png';

export function StoreLocation() {
  return (
    <section className="py-8 md:py-12 bg-secondary border-t border-border">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Store Photo */}
          <div className="relative aspect-video rounded-2xl overflow-hidden">
            <img
              src={storeFrontImg}
              alt="Loja física iCamStore"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-2 text-white">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="font-medium">Loja Física - São Paulo, SP</span>
              </div>
            </div>
          </div>

          {/* Store Info and Instagram */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Visite Nossa Loja</h2>
              <p className="text-muted-foreground mb-4">
                Atendimento presencial de segunda a sexta, das 9h às 18h, e aos sábados das 9h às 13h.
              </p>
              <div className="flex items-start gap-3 p-4 bg-background rounded-xl border border-border">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">iCamStore</p>
                  <p className="text-sm text-muted-foreground">
                    Rua Augusta, 1234 - Consolação<br />
                    São Paulo - SP, 01304-000
                  </p>
                </div>
              </div>
            </div>

            {/* Instagram Section */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Instagram className="h-5 w-5 text-primary" />
                Siga-nos no Instagram
              </h3>
              <a
                href="https://instagram.com/icamstore"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-4 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-xl border border-border hover:border-primary/50 transition-all"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary via-accent to-primary flex items-center justify-center shrink-0">
                  <Instagram className="h-8 w-8 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-lg group-hover:text-primary transition-colors">@icamstore</p>
                  <p className="text-sm text-muted-foreground">Novidades, dicas e bastidores</p>
                </div>
                <span className="px-4 py-2 bg-primary text-primary-foreground rounded-full font-medium text-sm group-hover:scale-105 transition-transform">
                  Seguir
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
