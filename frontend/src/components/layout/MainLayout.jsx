import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Drawer from './Drawer';
import BottomNav from './BottomNav';

const MainLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-surface text-on-surface">
      <Header onOpenDrawer={() => setDrawerOpen(true)} />
      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      
      <main className="flex-1 w-full max-w-7xl mx-auto pt-16 pb-20 md:pb-8">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
};

export default MainLayout;
