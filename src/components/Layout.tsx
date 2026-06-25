import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import BottomNav from './BottomNav';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex h-screen bg-app-bg overflow-hidden text-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col md:pl-64 overflow-hidden">
        {/* Contenedor principal con fondo blanco y bordes redondeados en desktop */}
        <div className="flex-1 m-0 md:m-4 bg-background md:rounded-[2.5rem] overflow-hidden shadow-sm flex flex-col relative">
          <main className="flex-1 overflow-y-auto pb-24 md:pb-0">
            {children}
          </main>
        </div>
      </div>
      {/* BottomNav se encarga de mostrarse solo en mobile usando clases CSS */}
      <BottomNav />
    </div>
  );
};
