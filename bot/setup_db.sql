-- Copie este código e rode no SQL Editor do Supabase para criar a tabela dos usuários da comunidade

CREATE TABLE IF NOT EXISTS nc_users (
  telegram_id BIGINT PRIMARY KEY,
  username TEXT,
  first_name TEXT,
  area_atuacao TEXT,
  experiencia_ia TEXT,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (opcional para admin, mas boa prática)
ALTER TABLE nc_users ENABLE ROW LEVEL SECURITY;

-- Como o bot usa a service_role key, ele vai ignorar o RLS e conseguir ler/escrever normalmente.
