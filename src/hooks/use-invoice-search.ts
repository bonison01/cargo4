
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { Invoice } from '@/types/invoice';

export const useInvoiceSearch = (isAdmin: boolean) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchAllInvoices = useCallback(async () => {
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
        setInvoices(invoiceData as Invoice[]);
        setFilteredInvoices(invoiceData as Invoice[]);
      }
    } catch (error: any) {
      console.error('Error fetching invoices:', error);
      toast({
        title: "Error fetching invoices",
        description: error.message || "Could not load invoices. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  useEffect(() => {
    if (isAdmin) {
      fetchAllInvoices();
    }
  }, [isAdmin, fetchAllInvoices]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredInvoices(invoices);
      return;
    }
    
    const filtered = invoices.filter(invoice => 
      invoice.consignment_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.from_location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.to_location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.sender_info?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.receiver_info?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredInvoices(filtered);
  }, [searchTerm, invoices]);

  return { 
    searchTerm, 
    setSearchTerm, 
    filteredInvoices, 
    isLoading,
    refreshInvoices: fetchAllInvoices
  };
};
