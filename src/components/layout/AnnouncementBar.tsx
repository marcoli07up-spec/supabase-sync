import { forwardRef } from 'react';

export const AnnouncementBar = forwardRef<HTMLDivElement>((_, ref) => {
  const announcements = [
    '🎉 REINAUGURAÇÃO — Frete Grátis em TODOS os produtos!',
    '🚚 Aproveite: Frete Grátis para todo o Brasil na reinauguração!',
    '🎊 Promoção de Reinauguração — Envio Grátis para qualquer lugar!',
  ];

  return (
    <div ref={ref} className="bg-primary text-primary-foreground py-2 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...announcements, ...announcements, ...announcements].map((text, index) => (
          <span key={index} className="mx-8 text-sm font-medium">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
});

AnnouncementBar.displayName = 'AnnouncementBar';
