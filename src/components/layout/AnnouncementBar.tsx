import { forwardRef } from 'react';

export const AnnouncementBar = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div ref={ref} className="bg-primary text-primary-foreground py-2 text-center">
      <span className="text-sm font-medium">
        🎉 REINAUGURAÇÃO — Frete Grátis em TODOS os produtos!
      </span>
    </div>
  );
});

AnnouncementBar.displayName = 'AnnouncementBar';
