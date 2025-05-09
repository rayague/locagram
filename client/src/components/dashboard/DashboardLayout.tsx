import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardFooter from './DashboardFooter';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
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