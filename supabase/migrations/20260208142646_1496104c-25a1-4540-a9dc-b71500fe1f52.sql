-- Aprovar todas as avaliações existentes que foram criadas antes do novo sistema
UPDATE reviews SET approved = true WHERE approved = false;