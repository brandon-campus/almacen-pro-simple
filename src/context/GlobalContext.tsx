import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import type { Product, Sale, Expense, NewSalePayload, NewExpensePayload, ProductFormPayload, Organization } from '../types';
import {
  fetchOrganization,
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  fetchSalesToday,
  addSale,
  deleteSale,
  fetchExpenses,
  addExpense,
  deleteExpense,
} from '../services/supabase.service';

interface GlobalContextType {
  // Data
  productos: Product[];
  ventas: Sale[];
  gastos: Expense[];
  organization: Organization | null;
  // Auth
  isAuthenticated: boolean;
  session: Session | null;
  orgId: string | null;
  isLoading: boolean;
  // Auth actions
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string, orgName: string) => Promise<void>;
  logout: () => Promise<void>;
  // Product actions
  agregarProducto: (p: ProductFormPayload) => Promise<void>;
  editarProducto: (id: string, p: Partial<ProductFormPayload>) => Promise<void>;
  eliminarProducto: (id: string) => Promise<void>;
  // Sale actions
  registrarVenta: (item: NewSalePayload) => Promise<void>;
  eliminarVenta: (saleId: string) => Promise<void>;
  // Expense actions
  registrarGasto: (g: NewExpensePayload) => Promise<void>;
  eliminarGasto: (id: string) => Promise<void>;
  // Refresh
  refreshProductos: () => Promise<void>;
  refreshVentas: () => Promise<void>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [productos, setProductos] = useState<Product[]>([]);
  const [ventas, setVentas] = useState<Sale[]>([]);
  const [gastos, setGastos] = useState<Expense[]>([]);
  const [organization, setOrganization] = useState<Organization | null>(null);

  const [session, setSession] = useState<Session | null>(null);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  // ----------------------------------------------------------------
  // Carga de datos desde Supabase
  // ----------------------------------------------------------------

  const loadAllData = useCallback(async (oid: string) => {
    try {
      const [prods, sls, exps, org] = await Promise.all([
        fetchProducts(oid),
        fetchSalesToday(oid),
        fetchExpenses(oid),
        fetchOrganization(oid),
      ]);
      setProductos(prods);
      setVentas(sls);
      setGastos(exps);
      setOrganization(org);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      toast.error('Error al cargar los datos del almacén');
    }
  }, []);

  const refreshProductos = useCallback(async () => {
    if (!orgId) return;
    const prods = await fetchProducts(orgId);
    setProductos(prods);
  }, [orgId]);

  const refreshVentas = useCallback(async () => {
    if (!orgId) return;
    const sls = await fetchSalesToday(orgId);
    setVentas(sls);
  }, [orgId]);

  // ----------------------------------------------------------------
  // Auth listeners
  // ----------------------------------------------------------------

  const fetchUserOrg = async (userId: string): Promise<string | null> => {
    const { data, error } = await supabase
      .from('users')
      .select('org_id')
      .eq('id', userId)
      .single();

    if (error || !data) return null;
    return data.org_id;
  };

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setIsAuthenticated(!!session);
      if (session) {
        const oid = await fetchUserOrg(session.user.id);
        setOrgId(oid);
        if (oid) await loadAllData(oid);
      }
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setIsAuthenticated(!!session);
      if (session) {
        const oid = await fetchUserOrg(session.user.id);
        setOrgId(oid);
        if (oid) {
          setIsLoading(true);
          await loadAllData(oid);
          setIsLoading(false);
        }
      } else {
        setOrgId(null);
        setOrganization(null);
        setProductos([]);
        setVentas([]);
        setGastos([]);
      }
    });

    return () => subscription.unsubscribe();
  }, [loadAllData]);

  // ----------------------------------------------------------------
  // Auth actions
  // ----------------------------------------------------------------

  const login = async (email: string, pass: string) => {
    if (!email.trim() || !pass.trim()) {
      toast.error('Completá ambos campos para ingresar');
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) {
      toast.error(error.message === 'Invalid login credentials' ? 'Email o contraseña incorrectos' : error.message);
      throw error;
    }
    toast.success('¡Bienvenido de vuelta!');
  };

  const signup = async (email: string, pass: string, orgName: string) => {
    if (!email.trim() || !pass.trim() || !orgName.trim()) {
      toast.error('Completá todos los campos para registrarte');
      return;
    }
    if (pass.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({ email, password: pass });
      if (authError) throw authError;

      const user = authData.user;
      if (!user) throw new Error('No se pudo crear el usuario');

      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert([{ name: orgName, owner_id: user.id }])
        .select()
        .single();
      if (orgError) throw orgError;

      const { error: userError } = await supabase
        .from('users')
        .insert([{ id: user.id, org_id: orgData.id, email: user.email, role: 'owner' }]);
      if (userError) throw userError;

      toast.success('¡Cuenta creada! Revisá tu email para confirmarla.');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Error al crear la cuenta');
      throw err;
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Error al cerrar sesión');
    } else {
      toast.info('Sesión cerrada');
    }
  };

  // ----------------------------------------------------------------
  // Product actions
  // ----------------------------------------------------------------

  const agregarProducto = async (payload: ProductFormPayload) => {
    if (!orgId) return;
    try {
      const newProd = await addProduct(orgId, payload);
      setProductos(prev => [...prev, newProd].sort((a, b) => a.name.localeCompare(b.name)));
      toast.success('Producto agregado');
    } catch (err: any) {
      toast.error(err.message || 'Error al agregar el producto');
      throw err;
    }
  };

  const editarProducto = async (id: string, payload: Partial<ProductFormPayload>) => {
    try {
      const updated = await updateProduct(id, payload);
      setProductos(prev => prev.map(p => p.id === id ? updated : p));
      toast.success('Producto actualizado');
    } catch (err: any) {
      toast.error(err.message || 'Error al actualizar el producto');
      throw err;
    }
  };

  const eliminarProducto = async (id: string) => {
    try {
      await deleteProduct(id);
      setProductos(prev => prev.filter(p => p.id !== id));
      toast.info('Producto eliminado');
    } catch (err: any) {
      toast.error(err.message || 'Error al eliminar el producto');
      throw err;
    }
  };

  // ----------------------------------------------------------------
  // Sale actions
  // ----------------------------------------------------------------

  const registrarVenta = async (item: NewSalePayload) => {
    if (!orgId) return;

    const producto = productos.find(p => p.id === item.product_id);
    if (!producto) {
      toast.error('Producto no encontrado en inventario');
      return;
    }
    if (producto.stock_quantity < item.quantity) {
      toast.error('Stock insuficiente para esta venta');
      return;
    }

    try {
      await addSale(orgId, item);
      // Refrescar tanto ventas como productos (el stock cambió)
      const [sls, prods] = await Promise.all([fetchSalesToday(orgId), fetchProducts(orgId)]);
      setVentas(sls);
      setProductos(prods);
      toast.success('¡Venta registrada!');
    } catch (err: any) {
      toast.error(err.message || 'Error al registrar la venta');
      throw err;
    }
  };

  const eliminarVenta = async (saleId: string) => {
    const sale = ventas.find(v => v.id === saleId);
    const items = sale?.sale_items?.map(si => ({
      product_id: si.product_id,
      quantity: si.quantity,
    })) ?? [];

    try {
      await deleteSale(saleId, items);
      const [sls, prods] = await Promise.all([fetchSalesToday(orgId!), fetchProducts(orgId!)]);
      setVentas(sls);
      setProductos(prods);
      toast.info('Venta anulada y stock devuelto');
    } catch (err: any) {
      toast.error(err.message || 'Error al anular la venta');
      throw err;
    }
  };

  // ----------------------------------------------------------------
  // Expense actions
  // ----------------------------------------------------------------

  const registrarGasto = async (payload: NewExpensePayload) => {
    if (!orgId) return;
    try {
      const newExp = await addExpense(orgId, payload);
      setGastos(prev => [newExp, ...prev]);
      toast.success('Gasto registrado');
    } catch (err: any) {
      toast.error(err.message || 'Error al registrar el gasto');
      throw err;
    }
  };

  const eliminarGasto = async (id: string) => {
    try {
      await deleteExpense(id);
      setGastos(prev => prev.filter(g => g.id !== id));
      toast.info('Gasto eliminado');
    } catch (err: any) {
      toast.error(err.message || 'Error al eliminar el gasto');
      throw err;
    }
  };

  // ----------------------------------------------------------------
  // Render
  // ----------------------------------------------------------------

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Cargando tu almacén...</p>
        </div>
      </div>
    );
  }

  return (
    <GlobalContext.Provider value={{
      productos, ventas, gastos, organization,
      isAuthenticated, session, orgId, isLoading,
      login, signup, logout,
      agregarProducto, editarProducto, eliminarProducto,
      registrarVenta, eliminarVenta,
      registrarGasto, eliminarGasto,
      refreshProductos, refreshVentas,
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) throw new Error('useGlobalContext must be used within GlobalProvider');
  return context;
};
