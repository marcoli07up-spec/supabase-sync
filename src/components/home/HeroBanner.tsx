import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBanners } from '@/hooks/useBanners';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function HeroBanner() {
  const { data: banners, isLoading } = useBanners();
  const [currentIndex, setCurrentIndex] = useState(0);

  const displayBanners = banners && banners.length > 0 ? banners : [
    {
      id: '1',
      title: 'Equipamentos de Fotografia Profissional',
      subtitle: 'As melhores câmeras e acessórios com os melhores preços',
      image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1920&q=80',
      link: '/categoria/cameras',
      button_text: 'Ver Ofertas',
      active: true,
      display_order: 1,
      created_at: null,
    },
  ];

  useEffect(() => {
    if (displayBanners.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayBanners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [displayBanners.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? displayBanners.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === displayBanners.length - 1 ? 0 : prev + 1));
  };

  if (isLoading) {
    return <Skeleton className="aspect-[21/9] w-full" />;
  }

  const currentBanner = displayBanners[currentIndex];

  return (
    <div className="relative overflow-hidden bg-muted">
      <div className="relative aspect-[21/9] sm:aspect-[21/8] lg:aspect-[21/7]">
        <img
          src={currentBanner.image_url}
          alt={currentBanner.title || 'Banner'}
          className="h-full w-full object-cover"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="container-custom">
            <div className="max-w-xl">
              {currentBanner.title && (
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-balance mb-4">
                  {currentBanner.title}
                </h1>
              )}
              {currentBanner.subtitle && (
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6">
                  {currentBanner.subtitle}
                </p>
              )}
              {currentBanner.link && currentBanner.button_text && (
                <Button asChild size="lg">
                  <Link to={currentBanner.link}>{currentBanner.button_text}</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      {displayBanners.length > 1 && (
        <>
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full opacity-80 hover:opacity-100 hidden sm:flex"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full opacity-80 hover:opacity-100 hidden sm:flex"
            onClick={goToNext}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {displayBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  'h-2 w-2 rounded-full transition-colors',
                  currentIndex === index ? 'bg-primary' : 'bg-primary/30 hover:bg-primary/50'
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
