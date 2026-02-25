import { ReactNode } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import DashboardFooter from '@/components/dashboard/DashboardFooter';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="pl-64">
        <Header />
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
        <DashboardFooter />
      </div>
    </div>
  );
} 