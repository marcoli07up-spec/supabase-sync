"use client";

import { Shield, CheckCircle, Award, Users, Star, Truck } from 'lucide-react';

export function SocialProof() {
  return (
    <section className="py-8 bg-gradient-to-r from-primary/5 via-secondary to-primary/5">
      <div className="container-custom">
        <div className="text-center mb-6">
          <h3 className="text-lg font-bold mb-2">Por que comprar na Câmeras Prime?</h3>
          <p className="text-sm text-muted-foreground">Mais de 5.000 clientes satisfeitos</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="flex flex-col items-center p-4 bg-background rounded-xl border border-border text-center">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <p className="font-semibold text-sm">Reclame Aqui</p>
            <span className="text-xs text-muted-foreground">Nota 9.2</span>
          </div>

          <div className="flex flex-col items-center p-4 bg-background rounded-xl border border-border text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <p className="font-semibold text-sm">1 Ano Garantia</p>
            <span className="text-xs text-muted-foreground">Cobertura total</span>
          </div>

          <div className="flex flex-col items-center p-4 bg-background rounded-xl border border-border text-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
              <Truck className="h-6 w-6 text-blue-600" />
            </div>
            <p className="font-semibold text-sm">Frete Grátis</p>
            <span className="text-xs text-muted-foreground">Todo Brasil</span>
          </div>

          <div className="flex flex-col items-center p-4 bg-background rounded-xl border border-border text-center">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <p className="font-semibold text-sm">+5.000</p>
            <span className="text-xs text-muted-foreground">Clientes felizes</span>
          </div>

          <div className="flex flex-col items-center p-4 bg-background rounded-xl border border-border text-center">
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-2">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
            <p className="font-semibold text-sm">4.9 Estrelas</p>
            <span className="text-xs text-muted-foreground">Avaliação média</span>
          </div>

          <div className="flex flex-col items-center p-4 bg-background rounded-xl border border-border text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
            <p className="font-semibold text-sm">100% Revisado</p>
            <span className="text-xs text-muted-foreground">Testado</span>
          </div>
        </div>
      </div>
    </section>
  );
}