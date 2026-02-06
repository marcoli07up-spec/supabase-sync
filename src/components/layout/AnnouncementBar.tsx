export function AnnouncementBar() {
  const announcements = [
    '📦 Frete Grátis para todo o Brasil',
    '🛒 Trocas e Devoluções em até 90 dias',
    '❤️ Satisfação Garantida ou dinheiro de volta',
  ];

  return (
    <div className="bg-primary text-primary-foreground py-2 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...announcements, ...announcements, ...announcements].map((text, index) => (
          <span key={index} className="mx-8 text-sm font-medium">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
