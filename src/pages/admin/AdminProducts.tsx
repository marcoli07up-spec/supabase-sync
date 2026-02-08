import { useState, useRef } from 'react';
import { Plus, Pencil, Trash2, X, Upload, Link as LinkIcon, ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  useAllProducts, 
  useAllCategories, 
  useCreateProduct, 
  useUpdateProduct, 
  useDeleteProduct 
} from '@/hooks/useAdmin';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/format';
import { Product } from '@/types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ProductFormData = {
  name: string;
  description: string;
  price: number;
  original_price: number | null;
  category_id: string | null;
  stock: number;
  featured: boolean;
  active: boolean;
  image_url: string;
  images: string[];
};

const emptyProduct: ProductFormData = {
  name: '',
  description: '',
  price: 0,
  original_price: null,
  category_id: null,
  stock: 1,
  featured: false,
  active: true,
  image_url: '',
  images: [],
};

export default function AdminProducts() {
  const { data: products, isLoading } = useAllProducts();
  const { data: categories } = useAllCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(emptyProduct);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const secondaryFileInputRef = useRef<HTMLInputElement>(null);

  const openCreateDialog = () => {
    setSelectedProduct(null);
    setFormData(emptyProduct);
    setDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      original_price: product.original_price,
      category_id: product.category_id,
      stock: product.stock || 0,
      featured: product.featured || false,
      active: product.active ?? true,
      image_url: product.image_url || '',
      images: product.images || [],
    });
    setDialogOpen(true);
  };

  const confirmDelete = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (productToDelete) {
      await deleteProduct.mutateAsync(productToDelete.id);
      toast.success('Produto excluído com sucesso!');
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (selectedProduct) {
        await updateProduct.mutateAsync({
          id: selectedProduct.id,
          ...formData,
        });
        toast.success('Produto atualizado com sucesso!');
      } else {
        await createProduct.mutateAsync(formData);
        toast.success('Produto criado com sucesso!');
      }
      setDialogOpen(false);
    } catch {
      toast.error('Erro ao salvar produto');
    }
  };

  const addImageUrl = () => {
    if (newImageUrl.trim() && formData.images.length < 10) {
      setFormData({
        ...formData,
        images: [...formData.images, newImageUrl.trim()],
        image_url: formData.image_url || newImageUrl.trim(),
      });
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      images: newImages,
      image_url: newImages[0] || '',
    });
  };

  const setAsMainImage = (index: number) => {
    const newImages = [...formData.images];
    const [selectedImage] = newImages.splice(index, 1);
    newImages.unshift(selectedImage);
    setFormData({
      ...formData,
      images: newImages,
      image_url: selectedImage,
    });
    toast.success('Imagem definida como principal!');
  };

  const uploadImage = async (file: File, isMain = false) => {
    try {
      setIsUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `products/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);
      
      if (isMain) {
        setFormData({
          ...formData,
          images: [publicUrl, ...formData.images],
          image_url: publicUrl,
        });
      } else {
        setFormData({
          ...formData,
          images: [...formData.images, publicUrl],
          image_url: formData.image_url || publicUrl,
        });
      }
      
      toast.success('Imagem enviada com sucesso!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Erro ao enviar imagem');
    } finally {
      setIsUploading(false);
    }
  };

  const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file, true);
    }
  };

  const handleSecondaryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => uploadImage(file, false));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Produto
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      ) : products && products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card key={product.id} className={!product.active ? 'opacity-50' : ''}>
              <CardContent className="p-4">
                <a 
                  href={`/produto/${product.id}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block aspect-square mb-4 rounded-lg overflow-hidden bg-muted hover:opacity-90 transition-opacity"
                >
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      Sem imagem
                    </div>
                  )}
                </a>
                <a 
                  href={`/produto/${product.id}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-semibold line-clamp-2 hover:text-primary transition-colors block"
                >
                  {product.name}
                </a>
                <p className="text-lg font-bold mt-1">{formatCurrency(product.price)}</p>
                <p className="text-sm text-muted-foreground">Estoque: {product.stock || 0}</p>
                
                <div className="flex gap-2 mt-4">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => openEditDialog(product)}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => confirmDelete(product)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Nenhum produto cadastrado.</p>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar primeiro produto
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Product Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedProduct ? 'Editar Produto' : 'Novo Produto'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label>Nome do Produto *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <Label>Descrição (HTML)</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={8}
                  placeholder="<p>Descrição do produto...</p>&#10;&#10;<table>&#10;  <tr><th>Especificação</th><th>Valor</th></tr>&#10;  <tr><td>Marca</td><td>Canon</td></tr>&#10;</table>"
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Aceita HTML: &lt;p&gt;, &lt;table&gt;, &lt;ul&gt;, &lt;strong&gt;, &lt;em&gt;, etc.
                </p>
              </div>

              <div>
                <Label>Preço *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>

              <div>
                <Label>Preço Original (riscado)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.original_price || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    original_price: e.target.value ? parseFloat(e.target.value) : null 
                  })}
                />
              </div>

              <div>
                <Label>Categoria</Label>
                <Select
                  value={formData.category_id || ''}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value || null })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Estoque</Label>
                <Input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                  />
                  <Label>Destaque</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.active}
                    onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                  />
                  <Label>Ativo</Label>
                </div>
              </div>
            </div>

            {/* Images Section */}
            <div className="md:col-span-2">
              <Label className="text-base font-semibold">Imagens do Produto</Label>
              
              {/* Main Image Upload */}
              <div className="mt-3 mb-4">
                <Label className="text-sm text-muted-foreground mb-2 block">Imagem Destaque</Label>
                <div className="flex gap-3">
                  <div 
                    className="w-32 h-32 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {formData.image_url ? (
                      <img src={formData.image_url} alt="Principal" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <>
                        <ImagePlus className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-xs text-muted-foreground">Clique para enviar</span>
                      </>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageUpload}
                    className="hidden"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-2">
                      Esta será a imagem principal exibida no card do produto.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {isUploading ? 'Enviando...' : 'Upload Destaque'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Secondary Images */}
              <div className="mb-4">
                <Label className="text-sm text-muted-foreground mb-2 block">Imagens Secundárias</Label>
                <div className="flex gap-2 mb-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => secondaryFileInputRef.current?.click()}
                    disabled={isUploading || formData.images.length >= 10}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Imagens
                  </Button>
                  <input
                    ref={secondaryFileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleSecondaryImageUpload}
                    className="hidden"
                  />
                  <div className="flex-1">
                    <Input
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="Ou cole URL da imagem"
                      disabled={formData.images.length >= 10}
                    />
                  </div>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={addImageUrl}
                    disabled={!newImageUrl.trim() || formData.images.length >= 10}
                  >
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Adicionar URL
                  </Button>
                </div>

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-5 gap-2">
                    {formData.images.map((url, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted group">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                          {index !== 0 && (
                            <button
                              type="button"
                              onClick={() => setAsMainImage(index)}
                              className="p-1.5 bg-primary text-primary-foreground rounded-full text-xs"
                              title="Definir como principal"
                            >
                              ★
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="p-1.5 bg-destructive text-destructive-foreground rounded-full"
                            title="Remover"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                        {index === 0 && (
                          <span className="absolute bottom-1 left-1 text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                            Principal
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  {formData.images.length}/10 imagens • Clique em ★ para definir como principal
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createProduct.isPending || updateProduct.isPending}>
                {selectedProduct ? 'Salvar Alterações' : 'Criar Produto'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir produto?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir "{productToDelete?.name}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
