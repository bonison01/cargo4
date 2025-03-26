import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';
import { Invoice } from '@/types/invoice';
import { TrackingStep } from '@/components/ui/track-timeline';
import { generateInvoicePDF, generateShippingLabel } from "@/utils/pdf-utils";

export const useInvoiceDetails = (id: string | undefined) => {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [trackingSteps, setTrackingSteps] = useState<TrackingStep[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [charges, setCharges] = useState({
    basicFreight: 0,
    cod: 0,
    freightHandling: 0,
    pickupDelivery: 0,
    packaging: 0,
    cwbCharge: 0,
    otherCharges: 0
  });
  const { toast } = useToast();

  const checkAdminStatus = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const userEmail = session.user.email || '';
      setIsAdmin(userEmail.endsWith('@mateng.com') || userEmail.includes('admin'));
    }
  }, []);

  const fetchInvoiceDetails = useCallback(async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Ensure status is one of the valid types before setting the invoice
        const validStatus = ['pending', 'processing', 'in-transit', 'delivered', 'cancelled'] as const;
        const typedStatus = validStatus.includes(data.status as any) 
          ? data.status as Invoice['status']
          : 'pending' as const;
        
        // Create a properly typed invoice object
        const typedInvoice: Invoice = {
          ...data,
          status: typedStatus
        };
        
        setInvoice(typedInvoice);
        
        // Try to parse charges from item_description if available
        if (data.item_description && data.item_description.includes('charges:')) {
          try {
            const chargesStr = data.item_description.split('charges:')[1].trim();
            setCharges(JSON.parse(chargesStr));
          } catch (e) {
            console.log('Error parsing charges from item_description:', e);
          }
        }
        
        // Create tracking steps based on status
        createTrackingSteps(typedInvoice);
      }
    } catch (error: any) {
      console.error('Error fetching invoice details:', error);
      toast({
        title: "Error fetching invoice details",
        description: error.message || "Could not load the invoice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [id, toast]);

  const createTrackingSteps = (data: Invoice) => {
    const steps: TrackingStep[] = [];
    const statuses = ['pending', 'processing', 'in-transit', 'delivered'];
    const statusLabels = ['Order Placed', 'Processing', 'In Transit', 'Delivered'];
    const createdDate = new Date(data.created_at);
    
    const currentStatusIndex = statuses.indexOf(data.status);
    
    for (let i = 0; i < statuses.length; i++) {
      const isCompleted = i <= currentStatusIndex;
      const isCurrent = i === currentStatusIndex;
      
      const stepDate = new Date(createdDate);
      stepDate.setDate(createdDate.getDate() + i);
      
      steps.push({
        status: statusLabels[i],
        location: i === 0 ? data.from_location : 
                i === statuses.length - 1 ? data.to_location : 
                i === 1 ? 'Sorting Center' : 'Transit Hub',
        timestamp: isCompleted ? 
                  stepDate.toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'}) +
                  ' • ' + stepDate.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'}) :
                  'Estimated: ' + new Date(createdDate.setDate(createdDate.getDate() + 3)).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'}),
        isCompleted,
        isCurrent
      });
    }
    
    setTrackingSteps(steps);
  };

  const handleDownloadInvoice = () => {
    if (invoice) {
      const doc = generateInvoicePDF(invoice);
      doc.save(`mateng-invoice-${invoice.consignment_no}.pdf`);
      
      toast({
        title: "Invoice Downloaded",
        description: `Invoice #${invoice.consignment_no} has been downloaded.`,
      });
    }
  };

  const handlePrintLabel = () => {
    if (invoice) {
      const doc = generateShippingLabel(invoice);
      doc.save(`mateng-shipping-label-${invoice.consignment_no}.pdf`);
      
      toast({
        title: "Shipping Label Generated",
        description: `Shipping label for #${invoice.consignment_no} has been generated.`,
      });
    }
  };

  useEffect(() => {
    checkAdminStatus();
  }, [checkAdminStatus]);

  useEffect(() => {
    if (id) {
      fetchInvoiceDetails();
    }
  }, [id, fetchInvoiceDetails]);

  return {
    invoice,
    isLoading,
    isAdmin,
    charges,
    trackingSteps,
    handleDownloadInvoice,
    handlePrintLabel
  };
};
