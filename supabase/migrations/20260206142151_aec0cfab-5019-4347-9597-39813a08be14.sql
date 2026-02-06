-- Limpar dados existentes
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM reviews;
DELETE FROM abandoned_carts;
DELETE FROM products;
DELETE FROM categories;
DELETE FROM banners;

-- Inserir categorias da Câmera & Foto
INSERT INTO categories (name, slug) VALUES
('Câmeras', 'cameras'),
('Lentes', 'lentes'),
('Áudio', 'audio'),
('Mochilas', 'mochilas'),
('Iluminação', 'iluminacao');

-- Inserir banners principais
INSERT INTO banners (title, subtitle, image_url, button_text, link, active, display_order) VALUES
('Câmera & Foto', 'Equipamentos Fotográficos de Alta Qualidade', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1920&q=80', 'Ver Ofertas', '/categoria/cameras', true, 1),
('Lentes Premium', 'As melhores lentes para seu equipamento', 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=1920&q=80', 'Conferir', '/categoria/lentes', true, 2);

-- Inserir produtos da loja Câmera & Foto
INSERT INTO products (name, description, price, original_price, image_url, category_id, stock, featured, active) VALUES
-- Câmeras
('Lente Tamron 28-75mm F/2.8 G2 – E-Mount SEMINOVA', 'Marca: TAMRON. Lente profissional para câmeras Sony E-Mount, ideal para fotografia e vídeo.', 3199.00, 3599.00, 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=500&q=80', (SELECT id FROM categories WHERE slug = 'lentes'), 5, true, true),
('Camera Sony ZV-E10 + 16-50mm SEMINOVA', 'Marca: SONY. Câmera mirrorless perfeita para vloggers e criadores de conteúdo.', 3599.00, 4099.00, 'https://images.unsplash.com/photo-1606986628253-e0a7f1088f9f?w=500&q=80', (SELECT id FROM categories WHERE slug = 'cameras'), 3, true, true),
('Câmera Sony A6700 + Lente 18-135mm SEMINOVOS', 'Marca: SONY. Kit completo com câmera APS-C de última geração e lente versátil.', 6700.00, 7500.00, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80', (SELECT id FROM categories WHERE slug = 'cameras'), 2, true, true),
('Câmera Sony ZV-E10 + Lente 16-50mm – Seminova!', 'Marca: SONY. Ideal para criadores de conteúdo, com foco automático rápido.', 3299.00, 3799.00, 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&q=80', (SELECT id FROM categories WHERE slug = 'cameras'), 4, false, true),
('Câmera Sony ZV-1 + Tripé de Mão – Seminova!', 'Marca: SONY. Compacta poderosa para vlog com tripé incluso.', 4299.00, 4899.00, 'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=500&q=80', (SELECT id FROM categories WHERE slug = 'cameras'), 2, false, true),
('Mic Lark M2 – Lacrado!', 'Marca: HOLLYLAND. Microfone sem fio profissional para gravações.', 1299.00, 1599.00, 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500&q=80', (SELECT id FROM categories WHERE slug = 'audio'), 10, true, true),
('DJI RS4 Pro – Lacrado!', 'Marca: DJI. Estabilizador gimbal profissional para câmeras pesadas.', 3600.00, 4200.00, 'https://images.unsplash.com/photo-1533425962554-eb4bdf9d156d?w=500&q=80', (SELECT id FROM categories WHERE slug = 'cameras'), 3, true, true),
('Lente Canon EF 50mm – Lacrada!', 'Marca: CANON. Lente prime clássica f/1.8 para retratos incríveis.', 1250.00, 1450.00, 'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=500&q=80', (SELECT id FROM categories WHERE slug = 'lentes'), 8, false, true),
('Câmera Canon EOS RP – Corpo Seminovo!', 'Marca: CANON. Mirrorless full-frame acessível da Canon.', 4050.00, 4650.00, 'https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?w=500&q=80', (SELECT id FROM categories WHERE slug = 'cameras'), 2, false, true),
('Câmera Sony A7 III – Seminova com Caixa!', 'Marca: SONY. Mirrorless full-frame profissional com excelente desempenho.', 6999.00, 7999.00, 'https://images.unsplash.com/photo-1516724562728-afc824a36e84?w=500&q=80', (SELECT id FROM categories WHERE slug = 'cameras'), 1, true, true),
('Câmera Canon 5D Mark III + Lente 24-105mm EF IS', 'Marca: CANON. Kit profissional completo para fotografia de eventos.', 8500.00, 9500.00, 'https://images.unsplash.com/photo-1520390138845-fd2d229dd553?w=500&q=80', (SELECT id FROM categories WHERE slug = 'cameras'), 1, false, true),
('Câmera Canon EOS R6 + Lente 24-105mm – Seminova', 'Marca: CANON. Mirrorless híbrida para foto e vídeo 4K.', 6200.00, 7200.00, 'https://images.unsplash.com/photo-1581591524425-c7e0978865fc?w=500&q=80', (SELECT id FROM categories WHERE slug = 'cameras'), 2, true, true),
('Câmera Sony FX30 + Tamron 17-70mm – Seminova!', 'Marca: SONY. Cinema line para produções audiovisuais profissionais.', 11450.00, 12500.00, 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500&q=80', (SELECT id FROM categories WHERE slug = 'cameras'), 1, false, true),
('Câmera Canon 5D Mark III – Seminova!', 'Marca: CANON. DSLR full-frame clássica para profissionais.', 4000.00, 4800.00, 'https://images.unsplash.com/photo-1505739818593-cc21ce8dc617?w=500&q=80', (SELECT id FROM categories WHERE slug = 'cameras'), 2, false, true),
('Lente Canon 24mm TS-E – Seminova!', 'Marca: CANON. Lente tilt-shift para arquitetura e paisagens.', 4250.00, 5000.00, 'https://images.unsplash.com/photo-1609818161565-42f419d9be57?w=500&q=80', (SELECT id FROM categories WHERE slug = 'lentes'), 1, false, true),
('Câmera Nikon D850 – Seminova!', 'Marca: NIKON. DSLR de alta resolução (45.7MP) para profissionais.', 3450.00, 4200.00, 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=500&q=80', (SELECT id FROM categories WHERE slug = 'cameras'), 1, false, true),
('Câmera Sony A6700 – Corpo Seminovo!', 'Marca: SONY. APS-C de última geração com IA para foco.', 4699.00, 5299.00, 'https://images.unsplash.com/photo-1617727553252-65863c156eb0?w=500&q=80', (SELECT id FROM categories WHERE slug = 'cameras'), 3, true, true),
('Câmera Canon G7X Mark III – Seminova!', 'Marca: CANON. Compacta premium para vloggers.', 5150.00, 5800.00, 'https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=500&q=80', (SELECT id FROM categories WHERE slug = 'cameras'), 2, false, true),
('Lente Tamron 150-600mm f/5-6.3 – Seminova!', 'Marca: TAMRON. Super teleobjetiva para fauna e esportes.', 8600.00, 9500.00, 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?w=500&q=80', (SELECT id FROM categories WHERE slug = 'lentes'), 1, false, true),
('Lente Sigma 70-200mm f/2.8 – Seminova!', 'Marca: SIGMA. Teleobjetiva profissional com estabilizador óptico.', 5100.00, 5900.00, 'https://images.unsplash.com/photo-1606986628253-e0a7f1088f9f?w=500&q=80', (SELECT id FROM categories WHERE slug = 'lentes'), 2, false, true),
('Câmera Sony A7R – Seminova!', 'Marca: SONY. Full-frame de alta resolução para paisagens.', 8100.00, 9000.00, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80', (SELECT id FROM categories WHERE slug = 'cameras'), 1, false, true),
('Mochila Fotográfica Profissional', 'Mochila ampla para câmeras e acessórios com proteção acolchoada.', 450.00, 550.00, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80', (SELECT id FROM categories WHERE slug = 'mochilas'), 15, true, true),
('Kit Iluminação LED Profissional', 'Kit completo com 2 painéis LED e tripés para estúdio.', 1800.00, 2200.00, 'https://images.unsplash.com/photo-1504198322253-cfa87a0ff25f?w=500&q=80', (SELECT id FROM categories WHERE slug = 'iluminacao'), 5, true, true),
('Softbox 60x90cm com Tripé', 'Softbox profissional para iluminação suave em estúdio.', 380.00, 450.00, 'https://images.unsplash.com/photo-1516035645781-9f126e774e9e?w=500&q=80', (SELECT id FROM categories WHERE slug = 'iluminacao'), 8, false, true),
('Microfone Shotgun Rode VideoMic', 'Marca: RODE. Microfone direcional para câmeras DSLR/Mirrorless.', 1450.00, 1700.00, 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=500&q=80', (SELECT id FROM categories WHERE slug = 'audio'), 6, false, true),
('Gravador de Áudio Zoom H6', 'Marca: ZOOM. Gravador portátil profissional com 6 canais.', 2200.00, 2600.00, 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=500&q=80', (SELECT id FROM categories WHERE slug = 'audio'), 4, false, true);

-- Inserir avaliações
INSERT INTO reviews (product_id, reviewer_name, rating, comment) 
SELECT id, 'Isabela Santos', 5, 'Comprei minha câmera seminova e veio impecável. Atendimento excelente e entrega rápida. Recomendo!'
FROM products WHERE name LIKE '%Sony A7 III%' LIMIT 1;

INSERT INTO reviews (product_id, reviewer_name, rating, comment) 
SELECT id, 'Mateus Oliveira', 5, 'Loja muito confiável. Produto com nota fiscal, garantia e exatamente como anunciado.'
FROM products WHERE name LIKE '%Canon EOS R6%' LIMIT 1;

INSERT INTO reviews (product_id, reviewer_name, rating, comment) 
SELECT id, 'Felipe Gomes', 5, 'Atendimento realmente especializado. Me ajudaram a escolher a câmera certa para o meu trabalho.'
FROM products WHERE name LIKE '%Sony ZV-E10%' LIMIT 1;

INSERT INTO reviews (product_id, reviewer_name, rating, comment) 
SELECT id, 'Gabriel Costa', 5, 'Preço justo, envio rápido e tudo com rastreio. Compra segura do começo ao fim.'
FROM products WHERE name LIKE '%Lente Tamron%' LIMIT 1;