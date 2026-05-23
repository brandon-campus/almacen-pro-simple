-- ==========================================
-- ALMACÉN PRO - ESQUEMA DE BASE DE DATOS
-- Copia y pega este script en el SQL Editor de Supabase
-- ==========================================

-- Habilitar extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. CREACIÓN DE TABLAS
-- ==========================================

-- Organizaciones (almacenes)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    owner_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    plan TEXT DEFAULT 'trial'
);

-- Productos
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES organizations(id) NOT NULL,
    name TEXT NOT NULL,
    sku TEXT,
    cost_price NUMERIC,
    sale_price NUMERIC NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    min_stock INTEGER DEFAULT 5,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ventas
CREATE TABLE sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES organizations(id) NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total NUMERIC NOT NULL,
    notes TEXT
);

-- Items de Venta (Detalle de cada producto vendido)
CREATE TABLE sale_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sale_id UUID REFERENCES sales(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price NUMERIC NOT NULL
);

-- Proveedores
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES organizations(id) NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gastos
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES organizations(id) NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    amount NUMERIC NOT NULL,
    category TEXT,
    description TEXT,
    supplier_id UUID REFERENCES suppliers(id)
);

-- Usuarios (Roles dentro del almacén)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    org_id UUID REFERENCES organizations(id) NOT NULL,
    email TEXT NOT NULL,
    role TEXT DEFAULT 'employee',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 2. HABILITAR ROW LEVEL SECURITY (RLS)
-- ==========================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 3. POLÍTICAS DE RLS (Aislamiento de Datos Multi-tenant)
-- ==========================================
-- Nota: El dueño del almacén tiene acceso completo a los datos de su propia organización.

-- Organizations
CREATE POLICY "El dueño puede ver su propia organización" ON organizations
    FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "El dueño puede actualizar su propia organización" ON organizations
    FOR UPDATE USING (auth.uid() = owner_id);

-- Products
CREATE POLICY "Acceso a los productos de la propia organización" ON products
    FOR ALL USING (org_id IN (SELECT id FROM organizations WHERE owner_id = auth.uid()));

-- Sales
CREATE POLICY "Acceso a las ventas de la propia organización" ON sales
    FOR ALL USING (org_id IN (SELECT id FROM organizations WHERE owner_id = auth.uid()));

-- Sale Items
CREATE POLICY "Acceso a los detalles de venta de la propia organización" ON sale_items
    FOR ALL USING (sale_id IN (SELECT id FROM sales WHERE org_id IN (SELECT id FROM organizations WHERE owner_id = auth.uid())));

-- Suppliers
CREATE POLICY "Acceso a los proveedores de la propia organización" ON suppliers
    FOR ALL USING (org_id IN (SELECT id FROM organizations WHERE owner_id = auth.uid()));

-- Expenses
CREATE POLICY "Acceso a los gastos de la propia organización" ON expenses
    FOR ALL USING (org_id IN (SELECT id FROM organizations WHERE owner_id = auth.uid()));

-- Users
CREATE POLICY "Acceso a ver usuarios de la propia organización" ON users
    FOR SELECT USING (org_id IN (SELECT id FROM organizations WHERE owner_id = auth.uid()) OR id = auth.uid());
