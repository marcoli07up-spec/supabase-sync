-- Adicionar campos para aprovação, imagens e data de exibição na tabela reviews
ALTER TABLE public.reviews 
ADD COLUMN IF NOT EXISTS approved boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS display_date timestamp with time zone DEFAULT now();

-- Atualizar política de leitura para mostrar apenas avaliações aprovadas
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;
CREATE POLICY "Anyone can view approved reviews" 
ON public.reviews 
FOR SELECT 
USING (approved = true AND display_date <= now());

-- Permitir que qualquer pessoa crie avaliações (pendentes de aprovação)
DROP POLICY IF EXISTS "Anyone can create reviews" ON public.reviews;
CREATE POLICY "Anyone can create reviews" 
ON public.reviews 
FOR INSERT 
WITH CHECK (true);

-- Criar bucket para imagens de avaliações
INSERT INTO storage.buckets (id, name, public)
VALUES ('review-images', 'review-images', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de storage para imagens de avaliações
CREATE POLICY "Anyone can view review images"
ON storage.objects FOR SELECT
USING (bucket_id = 'review-images');

CREATE POLICY "Anyone can upload review images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'review-images');

CREATE POLICY "Authenticated users can manage review images"
ON storage.objects FOR ALL
USING (bucket_id = 'review-images')
WITH CHECK (bucket_id = 'review-images');