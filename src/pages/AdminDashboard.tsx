
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/ui/navbar/navbar';
import PageTransition from '@/components/ui/page-transition';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FilePlus, Loader2 } from 'lucide-react';
import { useAdminCheck } from '@/hooks/use-admin-check';
import { useInvoiceSearch } from '@/hooks/use-invoice-search';
import InvoiceTable from '@/components/admin/InvoiceTable';
import InvoiceSearch from '@/components/admin/InvoiceSearch';
import AccessDenied from '@/components/admin/AccessDenied';

const AdminDashboard = () => {
  const { isAdmin, isLoading: isAdminLoading } = useAdminCheck();
  const { searchTerm, setSearchTerm, filteredInvoices, isLoading: isInvoicesLoading } = useInvoiceSearch(isAdmin);
  
  const isLoading = isAdminLoading || (isAdmin && isInvoicesLoading);

  if (!isAdmin && !isAdminLoading) {
    return <AccessDenied />;
  }

  return (
    <PageTransition>
      <Helmet>
        <title>Admin Dashboard - Mateng Shipping</title>
        <meta name="description" content="Admin dashboard for Mateng Shipping." />
      </Helmet>

      <Navbar />
      
      <main className="min-h-screen pt-28 pb-16">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage all shipments and invoices</p>
            </div>
            <Link to="/invoices/new">
              <Button className="bg-mateng-600 hover:bg-mateng-700">
                <FilePlus className="mr-2 h-4 w-4" />
                Create Invoice
              </Button>
            </Link>
          </div>
          
          <div className="mb-8">
            <InvoiceSearch 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm} 
            />
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-mateng-600" />
            </div>
          ) : (
            <div className="glass-card rounded-xl p-6 overflow-auto">
              <h2 className="text-xl font-semibold mb-4">All Invoices</h2>
              <InvoiceTable 
                invoices={filteredInvoices} 
                isLoading={isInvoicesLoading} 
              />
            </div>
          )}
        </div>
      </main>
    </PageTransition>
  );
};

export default AdminDashboard;
