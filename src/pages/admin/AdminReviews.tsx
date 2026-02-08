import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Star, 
  Check, 
  Trash2, 
  Plus, 
  Edit,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ReviewWithProduct {
  id: string;
  product_id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  images: string[] | null;
  approved: boolean;
  display_date: string;
  created_at: string;
  products: {
    name: string;
  } | null;
}

export default function AdminReviews() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<ReviewWithProduct | null>(null);

  // Form state
  const [selectedProduct, setSelectedProduct] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [displayDate, setDisplayDate] = useState(new Date().toISOString().split('T')[0]);

  // Fetch all reviews (including unapproved for admin)
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['admin', 'reviews', filter],
    queryFn: async () => {
      let query = supabase
        .from('reviews')
        .select('*, products(name)')
        .order('created_at', { ascending: false });

      if (filter === 'pending') {
        query = query.eq('approved', false);
      } else if (filter === 'approved') {
        query = query.eq('approved', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as ReviewWithProduct[];
    },
  });

  // Fetch products for dropdown
  const { data: products } = useQuery({
    queryKey: ['admin', 'products-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, name')
        .eq('active', true)
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  // Approve review
  const approveReview = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('reviews')
        .update({ approved: true })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
      toast.success('Avaliação aprovada!');
    },
    onError: () => toast.error('Erro ao aprovar avaliação'),
  });

  // Reject/Delete review
  const deleteReview = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
      toast.success('Avaliação removida!');
    },
    onError: () => toast.error('Erro ao remover avaliação'),
  });

  // Create/Update review
  const saveReview = useMutation({
    mutationFn: async () => {
      const reviewData = {
        product_id: selectedProduct,
        reviewer_name: reviewerName.trim(),
        rating,
        comment: comment.trim(),
        approved: true, // Admin-created reviews are auto-approved
        display_date: new Date(displayDate).toISOString(),
      };

      if (editingReview) {
        const { error } = await supabase
          .from('reviews')
          .update(reviewData)
          .eq('id', editingReview.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('reviews')
          .insert(reviewData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
      toast.success(editingReview ? 'Avaliação atualizada!' : 'Avaliação criada!');
      resetForm();
      setDialogOpen(false);
    },
    onError: () => toast.error('Erro ao salvar avaliação'),
  });

  const resetForm = () => {
    setSelectedProduct('');
    setReviewerName('');
    setRating(5);
    setComment('');
    setDisplayDate(new Date().toISOString().split('T')[0]);
    setEditingReview(null);
  };

  const openEditDialog = (review: ReviewWithProduct) => {
    setEditingReview(review);
    setSelectedProduct(review.product_id);
    setReviewerName(review.reviewer_name);
    setRating(review.rating);
    setComment(review.comment);
    setDisplayDate(new Date(review.display_date).toISOString().split('T')[0]);
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !reviewerName.trim() || !comment.trim()) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    saveReview.mutate();
  };

  const pendingCount = reviews?.filter(r => !r.approved).length || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Avaliações</h1>
          <p className="text-muted-foreground">
            Gerencie as avaliações dos produtos
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Avaliação
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingReview ? 'Editar Avaliação' : 'Criar Avaliação'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product select */}
              <div>
                <Label>Produto *</Label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione um produto" />
                  </SelectTrigger>
                  <SelectContent>
                    {products?.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Reviewer name */}
              <div>
                <Label>Nome do avaliador *</Label>
                <Input
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="Nome que aparecerá na avaliação"
                  className="mt-1"
                />
              </div>

              {/* Rating */}
              <div>
                <Label>Nota *</Label>
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1"
                    >
                      <Star
                        className={`h-7 w-7 ${
                          star <= rating
                            ? 'text-primary fill-primary'
                            : 'text-muted'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div>
                <Label>Comentário *</Label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Texto da avaliação..."
                  rows={4}
                  className="mt-1"
                />
              </div>

              {/* Display date */}
              <div>
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Data de exibição
                </Label>
                <Input
                  type="date"
                  value={displayDate}
                  onChange={(e) => setDisplayDate(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  A avaliação só aparecerá a partir desta data
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={saveReview.isPending}
              >
                {saveReview.isPending ? 'Salvando...' : 'Salvar Avaliação'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          Todas ({reviews?.length || 0})
        </Button>
        <Button
          variant={filter === 'pending' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('pending')}
          className="relative"
        >
          Pendentes
          {pendingCount > 0 && (
            <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
              {pendingCount}
            </Badge>
          )}
        </Button>
        <Button
          variant={filter === 'approved' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('approved')}
        >
          Aprovadas
        </Button>
      </div>

      {/* Reviews list */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          Carregando...
        </div>
      ) : reviews?.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground bg-muted/50 rounded-xl">
          Nenhuma avaliação encontrada
        </div>
      ) : (
        <div className="space-y-4">
          {reviews?.map((review) => (
            <div
              key={review.id}
              className={`bg-card border rounded-xl p-5 ${
                !review.approved ? 'border-warning bg-warning/5' : 'border-border'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="font-semibold">{review.reviewer_name}</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating
                              ? 'text-primary fill-primary'
                              : 'text-muted'
                          }`}
                        />
                      ))}
                    </div>
                    {!review.approved && (
                      <Badge variant="outline" className="text-warning border-warning">
                        Pendente
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    Produto: <strong>{review.products?.name || 'N/A'}</strong>
                  </p>
                  
                  <p className="text-muted-foreground">{review.comment}</p>
                  
                  {/* Images */}
                  {review.images && review.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {review.images.map((img, i) => (
                        <a
                          key={i}
                          href={img}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-16 h-16 rounded-lg overflow-hidden border"
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </a>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-xs text-muted-foreground mt-3">
                    Criada: {format(new Date(review.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    {' • '}
                    Exibir a partir: {format(new Date(review.display_date), "dd/MM/yyyy", { locale: ptBR })}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  {!review.approved && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-success hover:text-success hover:bg-success/10"
                      onClick={() => approveReview.mutate(review.id)}
                      title="Aprovar"
                    >
                      <Check className="h-5 w-5" />
                    </Button>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => openEditDialog(review)}
                    title="Editar"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      if (confirm('Remover esta avaliação?')) {
                        deleteReview.mutate(review.id);
                      }
                    }}
                    title="Remover"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
