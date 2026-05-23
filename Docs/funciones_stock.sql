-- ==========================================
-- FUNCIONES RPC PARA ACTUALIZAR STOCK
-- Copia y pega este script en el SQL Editor de Supabase
-- y dale a "Run" para crearlas.
-- ==========================================

-- Función para restar stock al confirmar una venta
CREATE OR REPLACE FUNCTION decrement_stock(p_product_id UUID, p_quantity INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE products
  SET stock_quantity = stock_quantity - p_quantity
  WHERE id = p_product_id;
END;
$$ LANGUAGE plpgsql;

-- Función para sumar stock al anular una venta
CREATE OR REPLACE FUNCTION increment_stock(p_product_id UUID, p_quantity INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE products
  SET stock_quantity = stock_quantity + p_quantity
  WHERE id = p_product_id;
END;
$$ LANGUAGE plpgsql;
