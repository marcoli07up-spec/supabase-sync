import { useState, useMemo, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Star, 
  Check, 
  Trash2, 
  Plus, 
  Edit,
  Calendar,
  Instagram,
  Search,
  Image,
  Video,
  X,
  Upload,
  CheckSquare,
  Square
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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
  instagram_handle: string | null;
  video_url: string | null;
  products: {
    name: string;
  } | null;
}

export default function AdminReviews() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<ReviewWithProduct | null>(null);
  const [productSearchOpen, setProductSearchOpen] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [selectedReviews, setSelectedReviews] = useState<Set<string>>(new Set());

  // Form state
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedProductName, setSelectedProductName] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [displayDate, setDisplayDate] = useState(new Date().toISOString().split('T')[0]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

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

  // Fetch products for search
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

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (!productSearch.trim()) return products;
    return products.filter(p => 
      p.name.toLowerCase().includes(productSearch.toLowerCase())
    );
  }, [products, productSearch]);

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
      setSelectedReviews(new Set());
      toast.success('Avaliação removida!');
    },
    onError: () => toast.error('Erro ao remover avaliação'),
  });

  // Bulk delete reviews
  const bulkDeleteReviews = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .in('id', ids);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
      setSelectedReviews(new Set());
      toast.success('Avaliações removidas!');
    },
    onError: () => toast.error('Erro ao remover avaliações'),
  });

  const toggleSelectReview = (id: string) => {
    setSelectedReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedReviews.size === (reviews?.length || 0)) {
      setSelectedReviews(new Set());
    } else {
      setSelectedReviews(new Set(reviews?.map(r => r.id) || []));
    }
  };

  const handleBulkDelete = () => {
    if (selectedReviews.size === 0) return;
    if (confirm(`Remover ${selectedReviews.size} avaliação(ões)?`)) {
      bulkDeleteReviews.mutate(Array.from(selectedReviews));
    }
  };

  // Upload image to storage
  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `reviews/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('review-images')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return null;
    }

    const { data } = supabase.storage
      .from('review-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newImages: string[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) {
        toast.error('Apenas imagens são permitidas');
        continue;
      }
      const url = await uploadImage(file);
      if (url) {
        newImages.push(url);
      }
    }

    setUploadedImages(prev => [...prev, ...newImages]);
    setIsUploading(false);
    
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  // Handle video upload
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      toast.error('Apenas vídeos são permitidos');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast.error('Vídeo muito grande (máx 50MB)');
      return;
    }

    setIsUploading(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `videos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('review-images')
      .upload(filePath, file);

    if (uploadError) {
      toast.error('Erro ao enviar vídeo');
      setIsUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from('review-images')
      .getPublicUrl(filePath);

    setVideoUrl(data.publicUrl);
    setIsUploading(false);

    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  // Create/Update review
  const saveReview = useMutation({
    mutationFn: async () => {
      const reviewData = {
        product_id: selectedProduct,
        reviewer_name: reviewerName.trim(),
        instagram_handle: instagramHandle.trim() || null,
        rating,
        comment: comment.trim(),
        images: uploadedImages.length > 0 ? uploadedImages : null,
        video_url: videoUrl || null,
        approved: true,
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
    setSelectedProductName('');
    setReviewerName('');
    setInstagramHandle('');
    setRating(5);
    setComment('');
    setDisplayDate(new Date().toISOString().split('T')[0]);
    setUploadedImages([]);
    setVideoUrl('');
    setEditingReview(null);
    setProductSearch('');
  };

  const openEditDialog = (review: ReviewWithProduct) => {
    setEditingReview(review);
    setSelectedProduct(review.product_id);
    setSelectedProductName(review.products?.name || '');
    setReviewerName(review.reviewer_name);
    setInstagramHandle(review.instagram_handle || '');
    setRating(review.rating);
    setComment(review.comment);
    setDisplayDate(new Date(review.display_date).toISOString().split('T')[0]);
    setUploadedImages(review.images || []);
    setVideoUrl(review.video_url || '');
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
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingReview ? 'Editar Avaliação' : 'Criar Avaliação'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product search */}
              <div>
                <Label>Produto *</Label>
                <Popover open={productSearchOpen} onOpenChange={setProductSearchOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={productSearchOpen}
                      className="w-full justify-between mt-1 h-auto min-h-10 py-2"
                    >
                      <span className="truncate text-left flex-1">
                        {selectedProductName || 'Pesquisar produto...'}
                      </span>
                      <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput 
                        placeholder="Buscar produto..." 
                        value={productSearch}
                        onValueChange={setProductSearch}
                      />
                      <CommandList>
                        <CommandEmpty>Nenhum produto encontrado.</CommandEmpty>
                        <CommandGroup className="max-h-64 overflow-auto">
                          {filteredProducts.map((product) => (
                            <CommandItem
                              key={product.id}
                              value={product.name}
                              onSelect={() => {
                                setSelectedProduct(product.id);
                                setSelectedProductName(product.name);
                                setProductSearchOpen(false);
                                setProductSearch('');
                              }}
                            >
                              {product.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
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

              {/* Instagram handle (optional) */}
              <div>
                <Label className="flex items-center gap-2">
                  <Instagram className="h-4 w-4" />
                  Instagram (opcional)
                </Label>
                <Input
                  value={instagramHandle}
                  onChange={(e) => setInstagramHandle(e.target.value.replace('@', ''))}
                  placeholder="usuario_instagram"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Sem o @ (será adicionado automaticamente)
                </p>
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

              {/* Image upload */}
              <div>
                <Label className="flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  Fotos
                </Label>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {isUploading ? 'Enviando...' : 'Adicionar fotos'}
                  </Button>
                </div>
                {uploadedImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {uploadedImages.map((img, i) => (
                      <div key={i} className="relative group">
                        <img
                          src={img}
                          alt=""
                          className="w-16 h-16 rounded-lg object-cover border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Video upload */}
              <div>
                <Label className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  Vídeo
                </Label>
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
                <div className="mt-2">
                  {videoUrl ? (
                    <div className="flex items-center gap-2">
                      <video
                        src={videoUrl}
                        className="w-32 h-20 rounded-lg object-cover border"
                        muted
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setVideoUrl('')}
                        className="text-destructive"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Remover
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => videoInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {isUploading ? 'Enviando...' : 'Adicionar vídeo'}
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Máximo 50MB
                </p>
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
                disabled={saveReview.isPending || isUploading}
              >
                {saveReview.isPending ? 'Salvando...' : 'Salvar Avaliação'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Bulk Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2 flex-wrap">
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

        {/* Bulk actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSelectAll}
            className="gap-2"
          >
            {selectedReviews.size === (reviews?.length || 0) && reviews?.length ? (
              <CheckSquare className="h-4 w-4" />
            ) : (
              <Square className="h-4 w-4" />
            )}
            {selectedReviews.size > 0 ? `${selectedReviews.size} selecionada(s)` : 'Selecionar todas'}
          </Button>
          {selectedReviews.size > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              disabled={bulkDeleteReviews.isPending}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir selecionadas
            </Button>
          )}
        </div>
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
              } ${selectedReviews.has(review.id) ? 'ring-2 ring-primary' : ''}`}
            >
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <button
                  type="button"
                  onClick={() => toggleSelectReview(review.id)}
                  className="shrink-0 mt-1"
                >
                  {selectedReviews.has(review.id) ? (
                    <CheckSquare className="h-5 w-5 text-primary" />
                  ) : (
                    <Square className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="font-semibold">{review.reviewer_name}</span>
                    {review.instagram_handle && (
                      <a
                        href={`https://instagram.com/${review.instagram_handle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
                      >
                        <Instagram className="h-3 w-3" />
                        @{review.instagram_handle}
                      </a>
                    )}
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
                  
                  {/* Images & Video */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {review.images && review.images.length > 0 && (
                      review.images.map((img, i) => (
                        <a
                          key={i}
                          href={img}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-16 h-16 rounded-lg overflow-hidden border"
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </a>
                      ))
                    )}
                    {review.video_url && (
                      <a
                        href={review.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-16 h-16 rounded-lg overflow-hidden border relative bg-muted flex items-center justify-center"
                      >
                        <Video className="h-6 w-6 text-muted-foreground" />
                      </a>
                    )}
                  </div>
                  
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
