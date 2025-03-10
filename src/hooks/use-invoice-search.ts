
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";

export const useInvoiceSearch = (isAdmin: boolean) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [invoices, setInvoices] = useState<any[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAllInvoices = async () => {
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
          setInvoices(invoiceData);
          setFilteredInvoices(invoiceData);
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
    };
    
    if (isAdmin) {
      fetchAllInvoices();
    }
  }, [isAdmin, toast]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredInvoices(invoices);
      return;
    }
    
    const filtered = invoices.filter(invoice => 
      invoice.consignment_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.from_location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.to_location?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredInvoices(filtered);
  }, [searchTerm, invoices]);

  return { 
    searchTerm, 
    setSearchTerm, 
    filteredInvoices, 
    isLoading 
  };
};
