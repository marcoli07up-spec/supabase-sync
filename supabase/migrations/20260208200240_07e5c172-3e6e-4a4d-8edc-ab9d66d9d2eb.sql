-- Delete existing reviews and create varied reviews for all products
DELETE FROM reviews;

-- Câmera Canon 5D Mark III – Seminova! (3 reviews)
INSERT INTO reviews (product_id, reviewer_name, rating, comment, approved, display_date, instagram_handle) VALUES 
('10b156bc-3999-477a-bc86-71422a309b5a', 'Roberto Gomes', 5, 'Clássica! Mesmo sendo mais antiga, a 5D Mark III ainda entrega fotos incríveis. Perfeita para quem quer uma full frame robusta sem gastar muito. Veio zerada!', true, NOW() - INTERVAL '6 days', 'robertogomesphoto'),
('10b156bc-3999-477a-bc86-71422a309b5a', 'Daniela Reis', 5, 'Uso para fotografia de casamento e ela nunca me decepcionou. Cores lindas direto da câmera. O vendedor foi super transparente sobre o estado do produto.', true, NOW() - INTERVAL '11 days', NULL),
('10b156bc-3999-477a-bc86-71422a309b5a', 'Fábio Martins', 4, 'Câmera muito boa para o preço. O corpo é robusto e aguenta bastante uso. Só lembrar que o autofoco não é tão rápido quanto os modelos mais novos.', true, NOW() - INTERVAL '20 days', NULL);

-- Câmera Canon 5D Mark III + Lente 24-105mm EF IS (2 reviews)
INSERT INTO reviews (product_id, reviewer_name, rating, comment, approved, display_date, instagram_handle) VALUES 
('317b2ca7-c18b-4293-a7fb-92c714ec720b', 'Marcos Pereira', 5, 'Kit perfeito para quem quer entrar no mundo full frame! A lente 24-105mm é super versátil para eventos e paisagens. Produto impecável!', true, NOW() - INTERVAL '4 days', 'marcospereirafoto'),
('317b2ca7-c18b-4293-a7fb-92c714ec720b', 'Aline Cardoso', 5, 'Comprei esse kit para fotografia de produtos e estou muito satisfeita. A nitidez é incrível e a lente cobre praticamente todas as situações.', true, NOW() - INTERVAL '15 days', 'alinecardosoph');

-- Câmera Canon EOS R6 + Lente 24-105mm (4 reviews)
INSERT INTO reviews (product_id, reviewer_name, rating, comment, approved, display_date, instagram_handle) VALUES 
('cb258b54-d017-422a-9043-af7260fc6b17', 'Fernando Rocha', 5, 'O IBIS dessa câmera é absurdo! Consigo gravar vídeo na mão sem estabilizador. A lente 24-105mm é muito versátil. Kit perfeito para fotografia de eventos!', true, NOW() - INTERVAL '4 days', 'fernandorochafoto'),
('cb258b54-d017-422a-9043-af7260fc6b17', 'Patricia Souza', 5, 'Upgrade perfeito vindo da 6D Mark II. O autofoco é muito mais rápido e preciso. Veio em estado de nova, com apenas 2 mil cliques no obturador.', true, NOW() - INTERVAL '10 days', NULL),
('cb258b54-d017-422a-9043-af7260fc6b17', 'Diego Cardoso', 4, 'Câmera excepcional para foto e vídeo. O único ponto é que ela aquece um pouco gravando 4K por muito tempo, mas para uso normal é perfeita.', true, NOW() - INTERVAL '18 days', 'diegocardosofilms'),
('cb258b54-d017-422a-9043-af7260fc6b17', 'Larissa Mendonça', 5, 'Já fotografei 3 casamentos com essa R6 e posso dizer: é a melhor câmera que já tive. O eye-AF funciona até em ambientes escuros!', true, NOW() - INTERVAL '25 days', NULL);

-- Câmera Canon EOS RP – Corpo Seminovo! (3 reviews)
INSERT INTO reviews (product_id, reviewer_name, rating, comment, approved, display_date, instagram_handle) VALUES 
('d4996ee0-d6ae-4931-976e-b96937e4f465', 'Renata Barbosa', 5, 'Entrada perfeita no mundo full frame mirrorless! Leve, compacta e com qualidade de imagem profissional. Melhor compra que já fiz!', true, NOW() - INTERVAL '5 days', 'renatababphoto'),
('d4996ee0-d6ae-4931-976e-b96937e4f465', 'Victor Hugo', 4, 'Ótima câmera para o preço. O corpo é bem leve e as fotos são lindas. Único ponto é que o buffer é um pouco limitado para fotos em sequência.', true, NOW() - INTERVAL '16 days', 'victorhugophotography'),
('d4996ee0-d6ae-4931-976e-b96937e4f465', 'Camila Torres', 5, 'Migrei do celular pra essa RP e a diferença é absurda! Qualidade profissional por um preço acessível.', true, NOW() - INTERVAL '22 days', NULL);

-- Câmera Canon G7X Mark III (2 reviews - está esgotada mas pode ter reviews)
INSERT INTO reviews (product_id, reviewer_name, rating, comment, approved, display_date, instagram_handle) VALUES 
('2f7b2b6c-8e0a-456a-a24b-93d3a01d0a69', 'Isabela Nunes', 5, 'A câmera perfeita para vloggers iniciantes! Cabe no bolso e grava em 4K. A tela flip é essencial para gravar sozinha. Amei!', true, NOW() - INTERVAL '4 days', 'isanunesvlog'),
('2f7b2b6c-8e0a-456a-a24b-93d3a01d0a69', 'Guilherme Pinto', 4, 'Boa câmera compacta para quem não quer carregar peso. O zoom óptico ajuda bastante. Só senti falta de entrada para microfone externo.', true, NOW() - INTERVAL '13 days', NULL);

-- Câmera Nikon D850 (3 reviews)
INSERT INTO reviews (product_id, reviewer_name, rating, comment, approved, display_date, instagram_handle) VALUES 
('4bb7d1a5-dc2e-4253-97ae-6ecfeed8ab4e', 'André Machado', 5, 'O sensor de 45MP dessa D850 é simplesmente espetacular para paisagem e arquitetura. A resolução permite crops absurdos sem perder qualidade!', true, NOW() - INTERVAL '3 days', 'andremachadophoto'),
('4bb7d1a5-dc2e-4253-97ae-6ecfeed8ab4e', 'Camila Ferraz', 5, 'Vim da D750 e a diferença é gritante. O visor óptico é enorme e muito nítido. Produto impecável, recomendo a loja de olhos fechados.', true, NOW() - INTERVAL '9 days', 'camilaferrazfoto'),
('4bb7d1a5-dc2e-4253-97ae-6ecfeed8ab4e', 'Eduardo Silva', 5, 'Melhor DSLR que a Nikon já fez! Uso para foto de produtos e a resolução é fantástica. Veio com caixa original e todos os acessórios.', true, NOW() - INTERVAL '17 days', NULL);

-- Câmera Sony A6700 – Corpo Seminovo! (4 reviews)
INSERT INTO reviews (product_id, reviewer_name, rating, comment, approved, display_date, instagram_handle) VALUES 
('393c3b87-c242-43fa-a07f-108d9d9935ac', 'Bruno Carvalho', 5, 'A A6700 é o melhor da Sony em APS-C! O novo processador faz uma diferença enorme no autofoco e na qualidade de vídeo 4K. Muito satisfeito!', true, NOW() - INTERVAL '2 days', 'brunocarvalhovisual'),
('393c3b87-c242-43fa-a07f-108d9d9935ac', 'Letícia Moura', 5, 'Compacta e poderosa! Uso para vlog de viagem e ela cabe em qualquer bolsa. A estabilização melhorou muito comparada à A6400.', true, NOW() - INTERVAL '7 days', 'leticiamoura.travel'),
('393c3b87-c242-43fa-a07f-108d9d9935ac', 'Henrique Lima', 4, 'Excelente upgrade da A6100. O menu novo ficou muito mais intuitivo e o autofoco com IA é impressionante.', true, NOW() - INTERVAL '14 days', NULL),
('393c3b87-c242-43fa-a07f-108d9d9935ac', 'Júlia Andrade', 5, 'Perfeita para quem quer qualidade profissional sem carregar peso de full frame. O 4K 120fps é um diferencial incrível!', true, NOW() - INTERVAL '21 days', 'juliaandradephoto');

-- Câmera Sony A6700 + Lente 18-135mm (2 reviews)
INSERT INTO reviews (product_id, reviewer_name, rating, comment, approved, display_date, instagram_handle) VALUES 
('2ded414c-19ae-4dec-b8f4-1807c9adde67', 'Ricardo Matos', 5, 'Kit perfeito para viagem! A lente 18-135mm cobre praticamente tudo e a câmera é super compacta. Gravei minhas férias inteiras com esse combo.', true, NOW() - INTERVAL '5 days', 'ricardomatosfilms'),
('2ded414c-19ae-4dec-b8f4-1807c9adde67', 'Fernanda Castro', 5, 'Veio tudo em estado impecável. A lente tem um range muito versátil e a estabilização óptica ajuda demais. Recomendo!', true, NOW() - INTERVAL '12 days', NULL);

-- Câmera Sony A7 III (5 reviews)
INSERT INTO reviews (product_id, reviewer_name, rating, comment, approved, display_date, instagram_handle) VALUES 
('016f90a8-f77c-4dba-8880-05f505bbe75a', 'Marcelo Ferreira', 5, 'A A7 III é simplesmente a melhor full frame nessa faixa de preço. O eye-AF é absurdo de bom! Veio com caixa original e em estado impecável.', true, NOW() - INTERVAL '1 day', 'marceloferreiraph'),
('016f90a8-f77c-4dba-8880-05f505bbe75a', 'Carolina Santos', 5, 'Finalmente realizei o sonho de ter uma full frame! A dinâmica de cores e o desempenho em baixa luz são incríveis.', true, NOW() - INTERVAL '8 days', 'carolsantosphoto'),
('016f90a8-f77c-4dba-8880-05f505bbe75a', 'Thiago Lima', 5, 'Migrei da Canon para Sony e não me arrependo. Essa A7 III é uma máquina! Atendimento nota 10.', true, NOW() - INTERVAL '15 days', NULL),
('016f90a8-f77c-4dba-8880-05f505bbe75a', 'Paula Ribeiro', 4, 'Câmera incrível, só acho que a Sony poderia melhorar a ergonomia do grip. Mas a qualidade de imagem compensa tudo!', true, NOW() - INTERVAL '23 days', 'paularibeirofoto'),
('016f90a8-f77c-4dba-8880-05f505bbe75a', 'Leonardo Costa', 5, 'Uso para vídeos corporativos e a qualidade é impressionante. O S-Log3 dá uma flexibilidade enorme na pós.', true, NOW() - INTERVAL '30 days', 'leocostamedia');

-- Câmera Sony A7R (1 review)
INSERT INTO reviews (product_id, reviewer_name, rating, comment, approved, display_date, instagram_handle) VALUES 
('c5f134c9-6cbe-4541-85d2-8f10e291f025', 'Gustavo Neves', 5, 'Full frame compacta com resolução absurda! Perfeita para paisagem e arquitetura. O dynamic range é excepcional.', true, NOW() - INTERVAL '6 days', 'gustavonevesfoto');

-- Câmera Sony FX30 + Tamron 17-70mm (3 reviews)
INSERT INTO reviews (product_id, reviewer_name, rating, comment, approved, display_date, instagram_handle) VALUES 
('acb58815-6017-432c-aa77-5ea5cfd1066d', 'Rodrigo Almeida', 5, 'A FX30 é um cinema camera de bolso! O S-Cinetone já sai pronto pra entregar. Kit perfeito com a Tamron 17-70mm.', true, NOW() - INTERVAL '3 days', 'rodrigoalmeidafilms'),
('acb58815-6017-432c-aa77-5ea5cfd1066d', 'Mariana Santos', 5, 'Uso para produção de conteúdo comercial e os clientes amam a qualidade. A lente Tamron tem ótimo custo-benefício.', true, NOW() - INTERVAL '11 days', 'marisantosproducoes'),
('acb58815-6017-432c-aa77-5ea5cfd1066d', 'Felipe Moreira', 4, 'Excelente para vídeo, mas lembrar que não tem IBIS. Com a Tamron estabilizada fica ótimo. Produto veio impecável!', true, NOW() - INTERVAL '19 days', NULL);

-- Câmera Sony ZV-1 + Tripé de Mão (6 reviews)
INSERT INTO reviews (product_id, reviewer_name, rating, comment, approved, display_date, instagram_handle) VALUES 
('6d3aeb02-23aa-4bb4-aaec-a7d13063bf3b', 'Lucas Mendes', 5, 'Câmera perfeita para vlog! O autofoco é impressionante, acompanha o rosto sem perder em nenhum momento. O tripé que veio junto é muito prático.', true, NOW() - INTERVAL '3 days', 'lucasvlogs'),
('6d3aeb02-23aa-4bb4-aaec-a7d13063bf3b', 'Beatriz Alves', 5, 'Estava procurando uma câmera compacta para gravar conteúdo e essa ZV-1 superou minhas expectativas. O microfone embutido é excelente!', true, NOW() - INTERVAL '7 days', NULL),
('6d3aeb02-23aa-4bb4-aaec-a7d13063bf3b', 'Pedro Nascimento', 4, 'Ótima câmera para quem está começando a produzir conteúdo. Só achei que a bateria poderia durar mais.', true, NOW() - INTERVAL '14 days', 'pedronascphoto'),
('6d3aeb02-23aa-4bb4-aaec-a7d13063bf3b', 'Amanda Lopes', 5, 'Uso para YouTube e TikTok e é simplesmente perfeita! Leve, compacta e com qualidade de cinema.', true, NOW() - INTERVAL '20 days', 'amandalopescontent'),
('6d3aeb02-23aa-4bb4-aaec-a7d13063bf3b', 'Rafael Torres', 5, 'O bokeh dessa câmera é lindo! Parece que gravei com equipamento de cinema. Amei o tripé que veio junto.', true, NOW() - INTERVAL '26 days', NULL),
('6d3aeb02-23aa-4bb4-aaec-a7d13063bf3b', 'Natália Souza', 4, 'Muito boa para vlog, só precisa de um ND filter externo para gravar no sol forte. De resto, perfeita!', true, NOW() - INTERVAL '33 days', 'natisouzavlog');

-- Camera Sony ZV-E10 + 16-50mm (5 reviews)
INSERT INTO reviews (product_id, reviewer_name, rating, comment, approved, display_date, instagram_handle) VALUES 
('4b180b7e-03a5-44a3-b28e-cfb1c3947fb4', 'Amanda Costa', 5, 'Melhor custo-benefício para criadores de conteúdo! A qualidade de vídeo é incrível e a lente kit já resolve bem para começar.', true, NOW() - INTERVAL '2 days', 'amandacreates'),
('4b180b7e-03a5-44a3-b28e-cfb1c3947fb4', 'Rafael Oliveira', 5, 'Estou impressionado com a qualidade dessa câmera. O sensor APS-C faz uma diferença enorme comparado ao meu celular.', true, NOW() - INTERVAL '5 days', NULL),
('4b180b7e-03a5-44a3-b28e-cfb1c3947fb4', 'Juliana Martins', 4, 'Câmera excelente para vídeo. A tela articulada é muito prática. Única observação é que sem estabilizador pode tremer um pouco.', true, NOW() - INTERVAL '12 days', 'julianafilms'),
('4b180b7e-03a5-44a3-b28e-cfb1c3947fb4', 'Matheus Ribeiro', 5, 'Upgrade perfeito para quem quer sair do celular! A ZV-E10 entrega qualidade profissional por um preço justo.', true, NOW() - INTERVAL '18 days', 'matheusribeirovisual'),
('4b180b7e-03a5-44a3-b28e-cfb1c3947fb4', 'Luiza Ferreira', 5, 'Comprei para meu canal de culinária e as cores são lindíssimas! O produto chegou em perfeito estado.', true, NOW() - INTERVAL '25 days', 'luizanaocozinha');

-- Câmera Sony ZV-E10 + Lente 16-50mm – Seminova! (2 reviews)
INSERT INTO reviews (product_id, reviewer_name, rating, comment, approved, display_date, instagram_handle) VALUES 
('da325a0d-6712-4898-bb72-347ac67c0dde', 'Gabriel Nunes', 5, 'Kit idêntico ao outro ZV-E10 que vende aqui, qualidade top! Veio seminova mas parecia nova de tão bem cuidada.', true, NOW() - INTERVAL '4 days', 'gabrielnunesvlog'),
('da325a0d-6712-4898-bb72-347ac67c0dde', 'Bianca Moreira', 4, 'Boa câmera para começar a produzir conteúdo. A lente kit resolve bem para a maioria das situações.', true, NOW() - INTERVAL '10 days', NULL);

-- Canon EOS RP – NOVA (1 review)
INSERT INTO reviews (product_id, reviewer_name, rating, comment, approved, display_date, instagram_handle) VALUES 
('8124d2b3-25ab-4d9e-9da1-c56949972d43', 'Vinícius Campos', 5, 'Lacrada! Abri a caixa aqui e tudo original. Primeira full frame mirrorless e estou apaixonado pela qualidade.', true, NOW() - INTERVAL '2 days', 'vinicamposfoto');

-- DJI RS4 Pro – Lacrado! (3 reviews)
INSERT INTO reviews (product_id, reviewer_name, rating, comment, approved, display_date, instagram_handle) VALUES 
('1062f82a-aa44-436f-bf4b-efea6c16e6ce', 'Caio Monteiro', 5, 'O RS4 Pro é absurdo! Aguenta minha A7 IV com lente pesada sem esforço. Os motores são muito silenciosos.', true, NOW() - INTERVAL '5 days', 'caiomonteirovideo'),
('1062f82a-aa44-436f-bf4b-efea6c16e6ce', 'Priscila Alves', 5, 'Migrei do RS3 para o RS4 Pro e a diferença é gritante. O novo sistema de travamento é muito prático!', true, NOW() - INTERVAL '13 days', 'priscilaalvesfilms'),
('1062f82a-aa44-436f-bf4b-efea6c16e6ce', 'Douglas Santos', 4, 'Gimbal top! Único ponto é que o app poderia ser mais intuitivo, mas para uso manual é excepcional.', true, NOW() - INTERVAL '22 days', NULL);

-- Gravador de Áudio Zoom H6 (4 reviews)
INSERT INTO reviews (product_id, reviewer_name, rating, comment, approved, display_date, instagram_handle) VALUES 
('903a2f4f-1098-4ab6-9680-975ba095f67b', 'Marcelo Andrade', 5, 'O H6 é o padrão da indústria por um motivo! 6 canais, qualidade profissional e super portátil. Uso em todas as produções.', true, NOW() - INTERVAL '3 days', 'marceloandradepod'),
('903a2f4f-1098-4ab6-9680-975ba095f67b', 'Fernanda Lima', 5, 'Comprei para meu podcast e a qualidade é impressionante. Os microfones intercambiáveis são um diferencial enorme.', true, NOW() - INTERVAL '9 days', 'fernandalimapodcast'),
('903a2f4f-1098-4ab6-9680-975ba095f67b', 'Roberto Dias', 4, 'Excelente gravador! A bateria dura bastante e a qualidade de áudio é broadcast. Veio em perfeito estado.', true, NOW() - INTERVAL '16 days', NULL),
('903a2f4f-1098-4ab6-9680-975ba095f67b', 'Tatiana Ramos', 5, 'Uso para gravar entrevistas e o áudio fica cristalino. Os pré-amps são muito limpos, zero ruído!', true, NOW() - INTERVAL '24 days', 'tatiramosaudio');

-- Kit Iluminação LED Profissional (2 reviews)
INSERT INTO reviews (product_id, reviewer_name, rating, comment, approved, display_date, instagram_handle) VALUES 
('1da76f9c-c9bb-42cc-bc71-cd95798a109e', 'Luciana Vieira', 5, 'Kit completo para quem está montando estúdio! A luz é bem suave e o dimmer funciona perfeitamente.', true, NOW() - INTERVAL '6 days', 'lucianavieiraph'),
('1da76f9c-c9bb-42cc-bc71-cd95798a109e', 'André Fonseca', 4, 'Bom custo-benefício para iniciantes. A montagem é simples e a luz é bem potente. Recomendo!', true, NOW() - INTERVAL '14 days', NULL);

-- Lente Canon 24mm TS-E (1 review)
INSERT INTO reviews (product_id, reviewer_name, rating, comment, approved, display_date, instagram_handle) VALUES 
('479c9c4b-937a-4ae7-a6fb-505a9b8b3d1b', 'Ricardo Pacheco', 5, 'Lente essencial para fotografia de arquitetura! O controle de perspectiva é fantástico. Veio em estado impecável.', true, NOW() - INTERVAL '8 days', 'ricardopachecoarq');

-- Lente Canon EF 50mm – Lacrada! (5 reviews)
INSERT INTO reviews (product_id, reviewer_name, rating, comment, approved, display_date, instagram_handle) VALUES 
('c300847a-c448-4486-8183-188038ecf1d6', 'Daniela Moura', 5, 'A famosa cinquentinha! Lacrada e original. Bokeh maravilhoso e nitidez absurda para o preço.', true, NOW() - INTERVAL '2 days', 'danielamouraphoto'),
('c300847a-c448-4486-8183-188038ecf1d6', 'Carlos Eduardo', 5, 'Melhor lente para retratos nessa faixa de preço! O f/1.8 permite fotos incríveis em baixa luz.', true, NOW() - INTERVAL '7 days', NULL),
('c300847a-c448-4486-8183-188038ecf1d6', 'Marina Costa', 5, 'Primeira lente que todo fotógrafo deveria ter. Qualidade profissional por um preço acessível.', true, NOW() - INTERVAL '13 days', 'marinacostafoto'),
('c300847a-c448-4486-8183-188038ecf1d6', 'Paulo Roberto', 4, 'Ótima lente! Só lembrar que o autofoco é um pouco barulhento, mas para foto não faz diferença.', true, NOW() - INTERVAL '19 days', NULL),
('c300847a-c448-4486-8183-188038ecf1d6', 'Cristiane Lopes', 5, 'Uso para ensaios e os clientes amam o resultado! Compressão de fundo linda demais.', true, NOW() - INTERVAL '27 days', 'crislopesretratos');

-- Lente Sigma 70-200mm f/2.8 (2 reviews)
INSERT INTO reviews (product_id, reviewer_name, rating, comment, approved, display_date, instagram_handle) VALUES 
('00b5fd10-cbf1-4c87-a473-3c60d220fd56', 'Fernando Bastos', 5, 'A Sigma 70-200 compete tranquilamente com a Canon! Nitidez absurda e estabilização muito boa.', true, NOW() - INTERVAL '4 days', 'fernandobastosfoto'),
('00b5fd10-cbf1-4c87-a473-3c60d220fd56', 'Patrícia Azevedo', 5, 'Uso para esportes e eventos e ela nunca me decepcionou. O f/2.8 constante é essencial!', true, NOW() - INTERVAL '12 days', NULL);

-- Lente Tamron 150-600mm (3 reviews)
INSERT INTO reviews (product_id, reviewer_name, rating, comment, approved, display_date, instagram_handle) VALUES 
('44c58832-5270-4128-af4e-ae8b2f82658f', 'Márcio Henrique', 5, 'Incrível para wildlife! Consegui fotos de pássaros que nunca imaginei. O alcance de 600mm é sensacional.', true, NOW() - INTERVAL '5 days', 'marciohenriquewild'),
('44c58832-5270-4128-af4e-ae8b2f82658f', 'Sandra Oliveira', 5, 'Melhor custo-benefício para telefoto longa! Uso para fotografia de aves e as fotos ficam nítidas.', true, NOW() - INTERVAL '11 days', 'sandraoliveiranature'),
('44c58832-5270-4128-af4e-ae8b2f82658f', 'Rogério Castro', 4, 'Lente pesada mas vale cada grama! A qualidade óptica surpreende pelo preço. Veio em ótimo estado.', true, NOW() - INTERVAL '18 days', NULL);

-- Lente Tamron 28-75mm F/2.8 G2 (4 reviews)
INSERT INTO reviews (product_id, reviewer_name, rating, comment, approved, display_date, instagram_handle) VALUES 
('dafef477-0cdc-4f0f-952e-c2e2747d6629', 'Giovana Martins', 5, 'A Tamron 28-75 G2 é sensacional! Leve, compacta e com qualidade que rivaliza com a Sony GM.', true, NOW() - INTERVAL '3 days', 'giovanamartinsph'),
('dafef477-0cdc-4f0f-952e-c2e2747d6629', 'Thiago Andrade', 5, 'Uso como lente principal na minha A7 IV e ela dá conta de tudo! Casamentos, ensaios, tudo!', true, NOW() - INTERVAL '8 days', 'thiagoandradewedding'),
('dafef477-0cdc-4f0f-952e-c2e2747d6629', 'Isabela Fernandes', 4, 'Excelente lente! O autofoco é rápido e silencioso. Única observação é um leve vinheteamento em 28mm.', true, NOW() - INTERVAL '15 days', NULL),
('dafef477-0cdc-4f0f-952e-c2e2747d6629', 'João Pedro', 5, 'Melhor custo-benefício em lentes 2.8 para Sony! Nitidez de centro a canto é impressionante.', true, NOW() - INTERVAL '23 days', 'joaopedrophotog');

-- Mic Lark M2 – Lacrado! (6 reviews)
INSERT INTO reviews (product_id, reviewer_name, rating, comment, approved, display_date, instagram_handle) VALUES 
('82807556-49e0-4733-9d63-8d9676a82986', 'Lucas Ribeiro', 5, 'Melhor microfone wireless dessa faixa de preço! O alcance é ótimo e a qualidade de áudio é cristalina.', true, NOW() - INTERVAL '1 day', 'lucasribeirovlog'),
('82807556-49e0-4733-9d63-8d9676a82986', 'Natasha Mendes', 5, 'Uso para gravar conteúdo na rua e ele cancela muito bem o ruído ambiente. Super recomendo!', true, NOW() - INTERVAL '4 days', 'natashamendescontent'),
('82807556-49e0-4733-9d63-8d9676a82986', 'Bruno Almeida', 5, 'Lacrado de fábrica! O pareamento é super rápido e a bateria dura o dia todo.', true, NOW() - INTERVAL '9 days', NULL),
('82807556-49e0-4733-9d63-8d9676a82986', 'Camila Duarte', 4, 'Muito bom para o preço! A redução de ruído funciona bem, mas em ambientes muito barulhentos ainda pega um pouco.', true, NOW() - INTERVAL '14 days', 'camiladuartecast'),
('82807556-49e0-4733-9d63-8d9676a82986', 'Eduardo Martins', 5, 'Comprei dois kits para gravar entrevistas e funcionam perfeitamente sincronizados!', true, NOW() - INTERVAL '20 days', NULL),
('82807556-49e0-4733-9d63-8d9676a82986', 'Ana Paula Silva', 5, 'Praticidade incrível! Coloco no bolso e saio gravando. Qualidade profissional.', true, NOW() - INTERVAL '28 days', 'anapaulasilvafilms');

-- Microfone Shotgun Rode VideoMic (3 reviews)
INSERT INTO reviews (product_id, reviewer_name, rating, comment, approved, display_date, instagram_handle) VALUES 
('b01ab0e2-3df0-492d-8a5a-08b06428330c', 'Henrique Santos', 5, 'O VideoMic é o padrão da indústria! Direcionalidade excelente e o áudio fica muito limpo.', true, NOW() - INTERVAL '6 days', 'henriquesantosfilm'),
('b01ab0e2-3df0-492d-8a5a-08b06428330c', 'Larissa Campos', 4, 'Muito bom para gravar entrevistas e vlogs. Só precisa de pilha, o que às vezes incomoda.', true, NOW() - INTERVAL '13 days', NULL),
('b01ab0e2-3df0-492d-8a5a-08b06428330c', 'Roberto Farias', 5, 'Uso há anos e nunca me decepcionou. Construção robusta e áudio profissional!', true, NOW() - INTERVAL '21 days', 'robertofariasaudio');

-- Mochila Fotográfica Profissional (4 reviews)
INSERT INTO reviews (product_id, reviewer_name, rating, comment, approved, display_date, instagram_handle) VALUES 
('4c22cccb-e7ee-43c7-badc-27a3208b2eb2', 'Vanessa Moreira', 5, 'Cabe todo meu kit! 2 corpos, 4 lentes e ainda sobra espaço. Super confortável para carregar.', true, NOW() - INTERVAL '2 days', 'vanessamoreiraphoto'),
('4c22cccb-e7ee-43c7-badc-27a3208b2eb2', 'Felipe Augusto', 5, 'Material resistente e os divisórios são bem acolchoados. Protege muito bem o equipamento.', true, NOW() - INTERVAL '7 days', NULL),
('4c22cccb-e7ee-43c7-badc-27a3208b2eb2', 'Claudia Ramos', 4, 'Boa mochila pelo preço. Cabe bastante coisa e é confortável. Só acho que poderia ter mais bolsos externos.', true, NOW() - INTERVAL '14 days', 'claudiaramosphoto'),
('4c22cccb-e7ee-43c7-badc-27a3208b2eb2', 'Marcos Vinícius', 5, 'Perfeita para viagens! Cabe como bagagem de mão e protege super bem as câmeras.', true, NOW() - INTERVAL '22 days', 'marcosvinicius.travel');

-- Softbox 60x90cm com Tripé (2 reviews)
INSERT INTO reviews (product_id, reviewer_name, rating, comment, approved, display_date, instagram_handle) VALUES 
('707cd3c3-709b-4a2b-ac8e-b947a66b18cd', 'Patrícia Mendes', 5, 'Luz super suave para retratos! A montagem é fácil e o tripé é bem estável.', true, NOW() - INTERVAL '5 days', 'patriciamendesph'),
('707cd3c3-709b-4a2b-ac8e-b947a66b18cd', 'Alexandre Neto', 4, 'Bom softbox para o preço. Luz bem difusa e uniforme. Ótimo para montar home studio.', true, NOW() - INTERVAL '11 days', NULL);