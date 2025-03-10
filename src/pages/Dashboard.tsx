
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/ui/navbar/navbar';
import PageTransition from '@/components/ui/page-transition';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsCards from '@/components/dashboard/StatsCards';
import RecentInvoices from '@/components/dashboard/RecentInvoices';
import { useDashboardData } from '@/hooks/use-dashboard-data';

const Dashboard = () => {
  const { searchTerm, setSearchTerm, filteredInvoices, isLoading, stats } = useDashboardData();

  return (
    <PageTransition>
      <Helmet>
        <title>Dashboard - Mateng Shipping</title>
        <meta name="description" content="Manage your shipments and invoices in your Mateng dashboard." />
      </Helmet>

      <Navbar />
      
      <main className="min-h-screen pt-28 pb-16">
        <div className="container px-4 mx-auto">
          <DashboardHeader />
          <StatsCards stats={stats} />
          <RecentInvoices
            invoices={[]}
            filteredInvoices={filteredInvoices}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isLoading={isLoading}
          />
        </div>
      </main>
    </PageTransition>
  );
};

export default Dashboard;
