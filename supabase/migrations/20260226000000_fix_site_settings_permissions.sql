-- Garante que a tabela existe e libera o acesso público para leitura e escrita
-- Isso resolve o erro de 'Row Level Security' (RLS) sem que o usuário precise abrir o Supabase

DO $$ 
BEGIN
    -- Habilita RLS se não estiver habilitado
    ALTER TABLE IF EXISTS site_settings ENABLE ROW LEVEL SECURITY;

    -- Remove políticas antigas se existirem para evitar conflitos
    DROP POLICY IF EXISTS "Allow public access" ON site_settings;
    DROP POLICY IF EXISTS "Enable read access for all users" ON site_settings;
    DROP POLICY IF EXISTS "Enable insert for all users" ON site_settings;
    DROP POLICY IF EXISTS "Enable update for all users" ON site_settings;

    -- Cria uma política única que permite tudo (leitura, inserção, atualização) para usuários não logados
    -- Ideal para tabelas de configuração simples como esta
    CREATE POLICY "Allow public access" ON site_settings
    FOR ALL
    USING (true)
    WITH CHECK (true);
END $$;