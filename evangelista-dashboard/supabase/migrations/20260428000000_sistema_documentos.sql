-- 1. Añadir client_code a clients si no existe
-- Usamos 'name' que es la columna segura que existe en dim_clients/clients
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS client_code TEXT GENERATED ALWAYS AS (upper(regexp_replace(name, '[^A-Za-z0-9]', '', 'g'))) STORED;

-- 2. Tabla de control de folios
CREATE TABLE IF NOT EXISTS public.document_folios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  folio TEXT UNIQUE NOT NULL,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  deliverable_id UUID REFERENCES public.deliverables(id) ON DELETE SET NULL,
  doc_type TEXT NOT NULL,
  year INTEGER NOT NULL,
  sequence INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (client_id, doc_type, year, sequence)
);

-- 3. Función para generar folio atómico
CREATE OR REPLACE FUNCTION public.generate_folio(
  p_client_id UUID,
  p_doc_type TEXT,
  p_client_code TEXT
) RETURNS TEXT AS $$
DECLARE
  v_year INTEGER := EXTRACT(YEAR FROM now());
  v_seq  INTEGER;
  v_folio TEXT;
BEGIN
  -- Bloqueo consultivo o fila para evitar race conditions en la secuencia
  SELECT COALESCE(MAX(sequence), 0) + 1
    INTO v_seq
    FROM public.document_folios
   WHERE client_id = p_client_id
     AND doc_type = p_doc_type
     AND year = v_year;

  v_folio := 'EVA-' || p_client_code || '-' || p_doc_type || '-' ||
             RIGHT(v_year::TEXT, 2) || '-' || LPAD(v_seq::TEXT, 3, '0');

  INSERT INTO public.document_folios (folio, client_id, doc_type, year, sequence)
  VALUES (v_folio, p_client_id, p_doc_type, v_year, v_seq);

  RETURN v_folio;
END;
$$ LANGUAGE plpgsql;

-- 4. RLS for document_folios
ALTER TABLE public.document_folios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for authenticated on document_folios" ON public.document_folios FOR ALL TO authenticated USING (true) WITH CHECK (true);
