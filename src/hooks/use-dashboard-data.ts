
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';
import { Invoice } from '@/types/invoice';
import { InvoiceProps } from '@/components/ui/invoice-card';

export const useDashboardData = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [invoices, setInvoices] = useState<InvoiceProps[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<InvoiceProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    active: 0,
    delivered: 0,
    pending: 0,
    totalValue: 0
  });

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setIsLoading(true);
        
        const { data: invoiceData, error } = await supabase
          .from('invoices')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        if (invoiceData) {
          const transformedInvoices: InvoiceProps[] = invoiceData.map((invoice: Invoice) => ({
            id: invoice.id,
            consignmentNo: invoice.consignment_no,
            from: invoice.from_location,
            to: invoice.to_location,
            date: new Date(invoice.created_at).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            }),
            status: invoice.status,
            amount: `₹${Number(invoice.amount).toLocaleString('en-IN')}`
          }));
          
          setInvoices(transformedInvoices);
          setFilteredInvoices(transformedInvoices);
          
          const active = invoiceData.filter((i: Invoice) => 
            i.status === 'processing' || i.status === 'in-transit'
          ).length;
          
          const delivered = invoiceData.filter((i: Invoice) => i.status === 'delivered').length;
          const pending = invoiceData.filter((i: Invoice) => i.status === 'pending').length;
          const totalValue = invoiceData.reduce((sum, i: Invoice) => sum + Number(i.amount), 0);
          
          setStats({
            active,
            delivered,
            pending,
            totalValue
          });
        }
      } catch (error: any) {
        console.error('Error fetching invoices:', error);
        toast({
          title: "Error fetching invoices",
          description: error.message || "Could not load your invoices. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInvoices();
  }, [toast]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredInvoices(invoices);
      return;
    }
    
    const filtered = invoices.filter(invoice => 
      invoice.consignmentNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.to.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredInvoices(filtered);
  }, [searchTerm, invoices]);

  return {
    searchTerm,
    setSearchTerm,
    invoices,
    filteredInvoices,
    isLoading,
    stats
  };
};
