'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import { registerNextNavigator } from '../utils/navigation';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname() || '/';
  const router = useRouter();

  useEffect(() => {
    registerNextNavigator((path: string) => {
      router.push(path);
    });
  }, [router]);

  const cleanPath = pathname.replace(/\/+$/, '') || '/';

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F3FF] text-[#1E1533] overflow-x-hidden">
      <Header currentPath={cleanPath} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};
