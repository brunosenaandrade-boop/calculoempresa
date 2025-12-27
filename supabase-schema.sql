-- =============================================
-- SCHEMA DO BANCO DE DADOS - GESTAOFACIL
-- Execute este SQL no Supabase SQL Editor
-- =============================================

-- Tabela: configuracoes
CREATE TABLE IF NOT EXISTS configuracoes (
  id INTEGER PRIMARY KEY DEFAULT 1,
  nome_empresa TEXT DEFAULT 'Selma Restaurante',
  taxa_simples DECIMAL(5,2) DEFAULT 7,
  taxa_cartao DECIMAL(5,2) DEFAULT 3,
  custo_fixo_percent DECIMAL(5,2) DEFAULT 30,
  lucro_desejado DECIMAL(5,2) DEFAULT 15,
  meta_diaria DECIMAL(10,2) DEFAULT 2000,
  suporte_telefone TEXT DEFAULT '48-99864-9898',
  tutorial_concluido BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela: insumos
CREATE TABLE IF NOT EXISTS insumos (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  unidade TEXT NOT NULL,
  preco_unitario DECIMAL(10,2) NOT NULL,
  fornecedor TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela: pratos
CREATE TABLE IF NOT EXISTS pratos (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  categoria TEXT NOT NULL,
  descricao TEXT,
  ingredientes JSONB DEFAULT '[]',
  custo_total DECIMAL(10,2) DEFAULT 0,
  preco_venda_sugerido DECIMAL(10,2) DEFAULT 0,
  preco_venda_real DECIMAL(10,2) NOT NULL,
  margem_real DECIMAL(5,2) DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela: vendas
CREATE TABLE IF NOT EXISTS vendas (
  id SERIAL PRIMARY KEY,
  data DATE NOT NULL,
  hora TEXT,
  itens JSONB NOT NULL DEFAULT '[]',
  forma_pagamento TEXT NOT NULL,
  valor_total DECIMAL(10,2) NOT NULL,
  desconto DECIMAL(10,2) DEFAULT 0,
  observacao TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela: custos_fixos
CREATE TABLE IF NOT EXISTS custos_fixos (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  categoria TEXT NOT NULL,
  dia_vencimento INTEGER,
  recorrente BOOLEAN DEFAULT true,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela: despesas_nao_operacionais
CREATE TABLE IF NOT EXISTS despesas_nao_operacionais (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL,
  valor_parcela DECIMAL(10,2) NOT NULL,
  parcela_atual INTEGER,
  total_parcelas INTEGER,
  mes_ano TEXT NOT NULL,
  observacao TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDICES PARA PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_vendas_data ON vendas(data);
CREATE INDEX IF NOT EXISTS idx_vendas_forma_pagamento ON vendas(forma_pagamento);
CREATE INDEX IF NOT EXISTS idx_pratos_categoria ON pratos(categoria);
CREATE INDEX IF NOT EXISTS idx_pratos_ativo ON pratos(ativo);
CREATE INDEX IF NOT EXISTS idx_insumos_ativo ON insumos(ativo);
CREATE INDEX IF NOT EXISTS idx_custos_fixos_ativo ON custos_fixos(ativo);

-- =============================================
-- POLITICAS DE SEGURANCA (RLS)
-- =============================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE configuracoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE insumos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pratos ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE custos_fixos ENABLE ROW LEVEL SECURITY;
ALTER TABLE despesas_nao_operacionais ENABLE ROW LEVEL SECURITY;

-- Politicas permissivas (para desenvolvimento - ajuste para producao)
CREATE POLICY "Permitir tudo em configuracoes" ON configuracoes FOR ALL USING (true);
CREATE POLICY "Permitir tudo em insumos" ON insumos FOR ALL USING (true);
CREATE POLICY "Permitir tudo em pratos" ON pratos FOR ALL USING (true);
CREATE POLICY "Permitir tudo em vendas" ON vendas FOR ALL USING (true);
CREATE POLICY "Permitir tudo em custos_fixos" ON custos_fixos FOR ALL USING (true);
CREATE POLICY "Permitir tudo em despesas_nao_operacionais" ON despesas_nao_operacionais FOR ALL USING (true);

-- =============================================
-- DADOS INICIAIS (OPCIONAL)
-- =============================================

-- Configuracao inicial
INSERT INTO configuracoes (id, nome_empresa, taxa_simples, taxa_cartao, custo_fixo_percent, lucro_desejado, meta_diaria, suporte_telefone)
VALUES (1, 'Selma Restaurante', 7, 3, 30, 15, 2000, '48-99864-9898')
ON CONFLICT (id) DO NOTHING;

-- Insumos de exemplo
INSERT INTO insumos (nome, unidade, preco_unitario) VALUES
('Arroz', 'KG', 3.30),
('Feijao', 'KG', 7.50),
('File Mignon', 'KG', 45.00),
('Frango', 'KG', 15.00),
('Queijo Mussarela', 'KG', 35.00),
('Presunto', 'KG', 25.00),
('Oleo', 'L', 8.00),
('Refrigerante 2L', 'UN', 7.00);

-- Custos fixos de exemplo
INSERT INTO custos_fixos (nome, valor, categoria) VALUES
('Aluguel', 2500.00, 'Infraestrutura'),
('Energia', 450.00, 'Infraestrutura'),
('Agua', 120.00, 'Infraestrutura'),
('Internet', 100.00, 'Servicos'),
('Funcionario', 1800.00, 'Pessoal');
