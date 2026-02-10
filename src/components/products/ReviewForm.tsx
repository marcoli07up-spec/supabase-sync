import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Star, Upload, X, Send, CheckCircle, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ReviewFormProps {
  productId: string;
  productName: string;
  compact?: boolean;
}

export function ReviewForm({ productId, productName, compact = false }: ReviewFormProps) {
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewerName, setReviewerName] = useState('');
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const submitReview = useMutation({
    mutationFn: async () => {
      const uploadedUrls: string[] = [];
      
      for (const image of images) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${productId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('review-images')
          .upload(fileName, image);
        
        if (uploadError) {
          console.error('Upload error:', uploadError);
          continue;
        }
        
        const { data: urlData } = supabase.storage
          .from('review-images')
          .getPublicUrl(fileName);
        
        uploadedUrls.push(urlData.publicUrl);
      }

      const { error } = await supabase.from('reviews').insert({
        product_id: productId,
        reviewer_name: reviewerName.trim(),
        rating,
        comment: comment.trim(),
        images: uploadedUrls,
        approved: false,
        display_date: new Date().toISOString(),
      });

      if (error) throw error;
    },
    onSuccess: () => {
      setSubmitted(true);
      toast.success('Avaliação enviada! Aguarde aprovação.');
    },
    onError: (err) => {
      console.error(err);
      toast.error('Erro ao enviar avaliação. Tente novamente.');
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      toast.error('Máximo de 5 imagens permitidas');
      return;
    }
    
    const newImages = [...images, ...files].slice(0, 5);
    setImages(newImages);
    
    const previews = newImages.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reviewerName.trim()) {
      toast.error('Digite seu nome');
      return;
    }
    if (!comment.trim()) {
      toast.error('Escreva sua avaliação');
      return;
    }
    
    submitReview.mutate();
  };

  if (submitted) {
    return (
      <div className="bg-success/10 border border-success/20 rounded-lg p-4 text-center">
        <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
        <p className="text-sm font-medium">Obrigado! Avaliação enviada.</p>
      </div>
    );
  }

  // Compact collapsed state
  if (compact && !isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground border border-border/50 rounded-md py-3 px-4 hover:border-border transition-colors"
      >
        <Star className="h-4 w-4" />
        <span>Avaliar este produto</span>
        <ChevronDown className="h-3.5 w-3.5" />
      </button>
    );
  }

  return (
    <div className={cn(
      "border border-border rounded-lg transition-all",
      compact ? "bg-muted/30 p-4" : "bg-card p-6"
    )}>
      {compact && (
        <button
          onClick={() => setIsExpanded(false)}
          className="flex items-center gap-2 text-sm text-muted-foreground mb-3 hover:text-foreground"
        >
          <ChevronDown className="h-4 w-4 rotate-180" />
          <span>Fechar</span>
        </button>
      )}
      
      {!compact && (
        <>
          <h3 className="text-lg font-bold mb-2">Avalie este produto</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Compartilhe sua experiência com o <strong>{productName}</strong>
          </p>
        </>
      )}

      <form onSubmit={handleSubmit} className={cn("space-y-4", compact && "space-y-3")}>
        {/* Rating */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Nota:</span>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-0.5"
              >
                <Star
                  className={cn(
                    compact ? "h-5 w-5" : "h-6 w-6",
                    star <= (hoverRating || rating)
                      ? 'text-primary fill-primary'
                      : 'text-muted'
                  )}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <Input
          value={reviewerName}
          onChange={(e) => setReviewerName(e.target.value)}
          placeholder="Seu nome"
          className={cn(compact && "h-9 text-sm")}
        />

        {/* Comment */}
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Conte sua experiência..."
          rows={compact ? 2 : 3}
          className={cn(compact && "text-sm min-h-[60px]")}
        />

        {/* Images - More compact */}
        <div className="flex items-center gap-2 flex-wrap">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative w-12 h-12">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover rounded"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </div>
          ))}
          
          {images.length < 5 && (
            <label className="w-12 h-12 border border-dashed border-border rounded flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
              <Upload className="h-4 w-4 text-muted-foreground" />
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
          <span className="text-xs text-muted-foreground">Fotos (opcional)</span>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          size={compact ? "sm" : "default"}
          className="w-full"
          disabled={submitReview.isPending}
        >
          {submitReview.isPending ? 'Enviando...' : (
            <>
              <Send className="h-3.5 w-3.5 mr-1.5" />
              Enviar
            </>
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Publicado após aprovação
        </p>
      </form>
    </div>
  );
}
