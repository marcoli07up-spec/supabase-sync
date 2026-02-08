import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Star, Upload, X, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ReviewFormProps {
  productId: string;
  productName: string;
}

export function ReviewForm({ productId, productName }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewerName, setReviewerName] = useState('');
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const submitReview = useMutation({
    mutationFn: async () => {
      // Upload images first
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

      // Create review (pending approval)
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
    
    // Create previews
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
      <div className="bg-success/10 border border-success/20 rounded-xl p-8 text-center">
        <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Obrigado pela sua avaliação!</h3>
        <p className="text-muted-foreground">
          Sua avaliação foi enviada e será publicada após aprovação.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="text-lg font-bold mb-4">Avalie este produto</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Compartilhe sua experiência com o <strong>{productName}</strong>
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <Label className="mb-2 block">Sua nota</Label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= (hoverRating || rating)
                      ? 'text-primary fill-primary'
                      : 'text-muted'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <div>
          <Label htmlFor="reviewer-name">Seu nome</Label>
          <Input
            id="reviewer-name"
            value={reviewerName}
            onChange={(e) => setReviewerName(e.target.value)}
            placeholder="Como você quer ser identificado"
            className="mt-2"
          />
        </div>

        {/* Comment */}
        <div>
          <Label htmlFor="comment">Sua avaliação</Label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Conte sua experiência com o produto..."
            rows={4}
            className="mt-2"
          />
        </div>

        {/* Images */}
        <div>
          <Label>Fotos (opcional)</Label>
          <p className="text-xs text-muted-foreground mb-2">
            Adicione até 5 fotos do produto
          </p>
          
          <div className="flex flex-wrap gap-3 mt-2">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative w-20 h-20">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            
            {images.length < 5 && (
              <label className="w-20 h-20 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                <Upload className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground mt-1">Adicionar</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full"
          disabled={submitReview.isPending}
        >
          {submitReview.isPending ? (
            'Enviando...'
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Enviar Avaliação
            </>
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Sua avaliação será publicada após aprovação da nossa equipe.
        </p>
      </form>
    </div>
  );
}
