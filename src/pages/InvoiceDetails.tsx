
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/ui/navbar/navbar';
import PageTransition from '@/components/ui/page-transition';
import InvoiceHeader from '@/components/invoice/InvoiceHeader';
import ShipmentInfo from '@/components/invoice/ShipmentInfo';
import TrackingHistory from '@/components/invoice/TrackingHistory';
import PricingDetails from '@/components/invoice/PricingDetails';
import ActionButtons from '@/components/invoice/ActionButtons';
import { useInvoiceDetails } from '@/hooks/use-invoice-details';

const InvoiceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const {
    invoice,
    isLoading,
    isAdmin,
    charges,
    trackingSteps,
    handleDownloadInvoice,
    handlePrintLabel
  } = useInvoiceDetails(id);

  if (isLoading) {
    return (
      <PageTransition>
        <Navbar />
        <main className="min-h-screen pt-28 pb-16">
          <div className="container px-4 mx-auto flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-mateng-600" />
          </div>
        </main>
      </PageTransition>
    );
  }

  if (!invoice) {
    return (
      <PageTransition>
        <Navbar />
        <main className="min-h-screen pt-28 pb-16">
          <div className="container px-4 mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Invoice Not Found</h1>
            <p className="mb-8">The invoice you're looking for doesn't exist or you don't have permission to view it.</p>
            <Link to="/dashboard">
              <Button className="bg-mateng-600 hover:bg-mateng-700">
                Return to Dashboard
              </Button>
            </Link>
          </div>
        </main>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Helmet>
        <title>Invoice #{invoice.consignment_no} - Mateng Shipping</title>
        <meta name="description" content={`Details for shipment from ${invoice.from_location} to ${invoice.to_location}`} />
      </Helmet>

      <Navbar />
      
      <main className="min-h-screen pt-28 pb-16">
        <div className="container px-4 mx-auto">
          <InvoiceHeader 
            consignmentNo={invoice.consignment_no}
            status={invoice.status}
            isAdmin={isAdmin}
            invoiceId={invoice.id}
            onPrintLabel={handlePrintLabel}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <ShipmentInfo invoice={invoice} />
              <TrackingHistory steps={trackingSteps} />
            </div>
            
            <div className="lg:col-span-1 space-y-8">
              <PricingDetails charges={charges} />
              <ActionButtons 
                onPrintLabel={handlePrintLabel}
                onDownloadInvoice={handleDownloadInvoice}
              />
            </div>
          </div>
        </div>
      </main>
    </PageTransition>
  );
};

export default InvoiceDetails;
