
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/ui/navbar/navbar';
import PageTransition from '@/components/ui/page-transition';
import { useParams } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { useInvoiceForm } from '@/hooks/use-invoice-form';
import InvoiceForm from '@/components/admin/InvoiceForm';
import AccessDenied from '@/components/admin/AccessDenied';
import LoadingState from '@/components/ui/loading-state';

const AdminEditInvoice = () => {
  const { id } = useParams<{ id: string }>();
  const { isAdmin, isLoading: isAdminLoading } = useAdminAuth();
  const { 
    invoiceData, 
    charges,
    isLoading: isInvoiceLoading, 
    isSubmitting,
    handleChange,
    handleChargeChange,
    handleStatusChange,
    handleModeChange,
    calculateSubtotal,
    calculateTotal,
    handleSubmit
  } = useInvoiceForm(id);

  if (isAdminLoading || (isAdmin && isInvoiceLoading)) {
    return <LoadingState />;
  }

  if (!isAdmin) {
    return <AccessDenied />;
  }

  return (
    <PageTransition>
      <Helmet>
        <title>{id ? 'Edit Invoice' : 'Create Invoice'} - Mateng Shipping</title>
        <meta name="description" content={id ? 'Edit a shipping invoice with Mateng Shipping.' : 'Create a new shipping invoice with Mateng Shipping.'} />
      </Helmet>

      <Navbar />
      
      <main className="min-h-screen pt-28 pb-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">{id ? 'Edit Invoice' : 'Create Invoice'} (Admin)</h1>
            <p className="text-muted-foreground mb-8">Fill in the details to {id ? 'update the' : 'create a new'} shipping invoice</p>
            
            <InvoiceForm
              invoiceData={invoiceData}
              charges={charges}
              handleChange={handleChange}
              handleChargeChange={handleChargeChange}
              handleStatusChange={handleStatusChange}
              handleModeChange={handleModeChange}
              calculateSubtotal={calculateSubtotal}
              calculateTotal={calculateTotal}
              handleSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              isEditing={!!id}
            />
          </div>
        </div>
      </main>
    </PageTransition>
  );
};

export default AdminEditInvoice;
