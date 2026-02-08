-- Delete all existing reviews to recreate them properly
DELETE FROM reviews;

-- Insert realistic reviews for specific products
-- Sony ZV-1 + Tripé
INSERT INTO reviews (product_id, reviewer_name, rating, comment, approved, display_date, instagram_handle)
VALUES 
('6d3aeb02-23aa-4bb4-aaec-a7d13063bf3b', 'Lucas Mendes', 5, 'Câmera perfeita para vlog! O autofoco é impressionante, acompanha o rosto sem perder em nenhum momento. O tripé que veio junto é muito prático. Veio em estado impecável, parece nova!', true, NOW() - INTERVAL '3 days', 'lucasvlogs'),
('6d3aeb02-23aa-4bb4-aaec-a7d13063bf3b', 'Beatriz Alves', 5, 'Estava procurando uma câmera compacta para gravar conteúdo e essa ZV-1 superou minhas expectativas. O microfone embutido é excelente! Chegou rapidinho e muito bem embalada.', true, NOW() - INTERVAL '7 days', NULL),
('6d3aeb02-23aa-4bb4-aaec-a7d13063bf3b', 'Pedro Nascimento', 4, 'Ótima câmera para quem está começando a produzir conteúdo. Só achei que a bateria poderia durar mais, mas fora isso, excelente! O vendedor foi muito atencioso.', true, NOW() - INTERVAL '14 days', 'pedronascphoto');

-- Sony ZV-E10 + 16-50mm
INSERT INTO reviews (product_id, reviewer_name, rating, comment, approved, display_date, instagram_handle)
VALUES 
('4b180b7e-03a5-44a3-b28e-cfb1c3947fb4', 'Amanda Costa', 5, 'Melhor custo-benefício para criadores de conteúdo! A qualidade de vídeo é incrível e a lente kit já resolve bem para começar. Veio seminova mas parecia tirada da caixa.', true, NOW() - INTERVAL '2 days', 'amandacreates'),
('4b180b7e-03a5-44a3-b28e-cfb1c3947fb4', 'Rafael Oliveira', 5, 'Estou impressionado com a qualidade dessa câmera. O sensor APS-C faz uma diferença enorme comparado ao meu celular. Recomendo demais, vendedor confiável!', true, NOW() - INTERVAL '5 days', NULL),
('4b180b7e-03a5-44a3-b28e-cfb1c3947fb4', 'Juliana Martins', 4, 'Câmera excelente para vídeo. A tela articulada é muito prática para gravar sozinha. Única observação é que sem estabilizador pode tremer um pouco, mas nada que um gimbal não resolva.', true, NOW() - INTERVAL '12 days', 'julianafilms');

-- Sony A7 III
INSERT INTO reviews (product_id, reviewer_name, rating, comment, approved, display_date, instagram_handle)
VALUES 
('016f90a8-f77c-4dba-8880-05f505bbe75a', 'Marcelo Ferreira', 5, 'A A7 III é simplesmente a melhor full frame nessa faixa de preço. O eye-AF é absurdo de bom! Veio com caixa original e em estado impecável. Super recomendo a loja!', true, NOW() - INTERVAL '1 day', 'marceloferreiraph'),
('016f90a8-f77c-4dba-8880-05f505bbe75a', 'Carolina Santos', 5, 'Finalmente realizei o sonho de ter uma full frame! A dinâmica de cores e o desempenho em baixa luz são incríveis. Produto em perfeito estado, entrega rápida.', true, NOW() - INTERVAL '8 days', 'carolsantosphoto'),
('016f90a8-f77c-4dba-8880-05f505bbe75a', 'Thiago Lima', 5, 'Migrei da Canon para Sony e não me arrependo. Essa A7 III é uma máquina! Atendimento nota 10, tiraram todas as minhas dúvidas antes da compra.', true, NOW() - INTERVAL '15 days', NULL);

-- Canon EOS R6 + 24-105mm
INSERT INTO reviews (product_id, reviewer_name, rating, comment, approved, display_date, instagram_handle)
VALUES 
('cb258b54-d017-422a-9043-af7260fc6b17', 'Fernando Rocha', 5, 'O IBIS dessa câmera é absurdo! Consigo gravar vídeo na mão sem estabilizador. A lente 24-105mm é muito versátil. Kit perfeito para fotografia de eventos!', true, NOW() - INTERVAL '4 days', 'fernandorochafoto'),
('cb258b54-d017-422a-9043-af7260fc6b17', 'Patricia Souza', 5, 'Upgrade perfeito vindo da 6D Mark II. O autofoco é muito mais rápido e preciso. Veio em estado de nova, com apenas 2 mil cliques no obturador.', true, NOW() - INTERVAL '10 days', NULL),
('cb258b54-d017-422a-9043-af7260fc6b17', 'Diego Cardoso', 4, 'Câmera excepcional para foto e vídeo. O único ponto é que ela aquece um pouco gravando 4K por muito tempo, mas para uso normal é perfeita.', true, NOW() - INTERVAL '18 days', 'diegocardosofilms');

-- Canon 5D Mark III
INSERT INTO reviews (product_id, reviewer_name, rating, comment, approved, display_date, instagram_handle)
VALUES 
('10b156bc-3999-477a-bc86-71422a309b5a', 'Roberto Gomes', 5, 'Clássica! Mesmo sendo mais antiga, a 5D Mark III ainda entrega fotos incríveis. Perfeita para quem quer uma full frame robusta sem gastar muito. Veio zerada!', true, NOW() - INTERVAL '6 days', 'robertogomesphoto'),
('10b156bc-3999-477a-bc86-71422a309b5a', 'Daniela Reis', 5, 'Uso para fotografia de casamento e ela nunca me decepcionou. Cores lindas direto da câmera. O vendedor foi super transparente sobre o estado do produto.', true, NOW() - INTERVAL '11 days', NULL);

-- Nikon D850
INSERT INTO reviews (product_id, reviewer_name, rating, comment, approved, display_date, instagram_handle)
VALUES 
('4bb7d1a5-dc2e-4253-97ae-6ecfeed8ab4e', 'André Machado', 5, 'O sensor de 45MP dessa D850 é simplesmente espetacular para paisagem e arquitetura. A resolução permite crops absurdos sem perder qualidade!', true, NOW() - INTERVAL '3 days', 'andremachadophoto'),
('4bb7d1a5-dc2e-4253-97ae-6ecfeed8ab4e', 'Camila Ferraz', 5, 'Vim da D750 e a diferença é gritante. O visor óptico é enorme e muito nítido. Produto impecável, recomendo a loja de olhos fechados.', true, NOW() - INTERVAL '9 days', 'camilaferrazfoto');

-- Sony A6700
INSERT INTO reviews (product_id, reviewer_name, rating, comment, approved, display_date, instagram_handle)
VALUES 
('393c3b87-c242-43fa-a07f-108d9d9935ac', 'Bruno Carvalho', 5, 'A A6700 é o melhor da Sony em APS-C! O novo processador faz uma diferença enorme no autofoco e na qualidade de vídeo 4K. Muito satisfeito!', true, NOW() - INTERVAL '2 days', 'brunocarvalhovisual'),
('393c3b87-c242-43fa-a07f-108d9d9935ac', 'Letícia Moura', 5, 'Compacta e poderosa! Uso para vlog de viagem e ela cabe em qualquer bolsa. A estabilização melhorou muito comparada à A6400.', true, NOW() - INTERVAL '7 days', 'leticiamoura.travel');

-- Canon G7X Mark III
INSERT INTO reviews (product_id, reviewer_name, rating, comment, approved, display_date, instagram_handle)
VALUES 
('2f7b2b6c-8e0a-456a-a24b-93d3a01d0a69', 'Isabela Nunes', 5, 'A câmera perfeita para vloggers iniciantes! Cabe no bolso e grava em 4K. A tela flip é essencial para gravar sozinha. Amei!', true, NOW() - INTERVAL '4 days', 'isanunesvlog'),
('2f7b2b6c-8e0a-456a-a24b-93d3a01d0a69', 'Guilherme Pinto', 4, 'Boa câmera compacta para quem não quer carregar peso. O zoom óptico ajuda bastante. Só senti falta de entrada para microfone externo.', true, NOW() - INTERVAL '13 days', NULL);

-- Canon EOS RP
INSERT INTO reviews (product_id, reviewer_name, rating, comment, approved, display_date, instagram_handle)
VALUES 
('d4996ee0-d6ae-4931-976e-b96937e4f465', 'Renata Barbosa', 5, 'Entrada perfeita no mundo full frame mirrorless! Leve, compacta e com qualidade de imagem profissional. Melhor compra que já fiz!', true, NOW() - INTERVAL '5 days', 'renatababphoto'),
('d4996ee0-d6ae-4931-976e-b96937e4f465', 'Victor Hugo', 4, 'Ótima câmera para o preço. O corpo é bem leve e as fotos são lindas. Único ponto é que o buffer é um pouco limitado para fotos em sequência.', true, NOW() - INTERVAL '16 days', 'victorhugophotography');