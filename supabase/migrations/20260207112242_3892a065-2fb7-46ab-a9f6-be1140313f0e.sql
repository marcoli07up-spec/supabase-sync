-- Delete existing banners
DELETE FROM banners;

-- Insert new banners with local asset paths
INSERT INTO banners (image_url, title, subtitle, button_text, link, active, display_order)
VALUES 
  ('/src/assets/banners/lentes-premium.png', 'Lentes', 'Qualidade profissional para suas fotos', 'Ver Lentes', '/categoria/lentes', true, 1),
  ('/src/assets/banners/audio-premium.png', 'Áudio', 'Equipamentos profissionais de som', 'Ver Áudio', '/categoria/audio', true, 2),
  ('/src/assets/banners/iluminacao-premium.png', 'Iluminação', 'Luz perfeita para cada cena', 'Ver Iluminação', '/categoria/iluminacao', true, 3),
  ('/src/assets/banners/usados-premium.png', 'Usados', 'Equipamentos revisados com garantia', 'Ver Usados', '/categoria/cameras-seminovas', true, 4);