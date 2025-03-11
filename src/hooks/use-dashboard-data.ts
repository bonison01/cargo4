
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';
import { Invoice } from '@/types/invoice';
import { InvoiceProps } from '@/components/ui/invoice-card';

// Define a type for the raw data from Supabase
interface RawInvoice {
  id: string;
  consignment_no: string;
  from_location: string;
  to_location: string;
  amount: number;
  status: string;
  created_at: string;
  updated_at?: string;
  user_id?: string;
  weight?: number | null;
  items?: string | null;
  pickup_date?: string | null;
  origin_city?: string | null;
  destination_city?: string | null;
  sender_info?: string | null;
  receiver_info?: string | null;
  item_count?: number | null;
  item_photo?: string | null;
  item_description?: string | null;
}

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
          // Type assertion to indicate that invoiceData is an array of RawInvoice objects
          const rawInvoices = invoiceData as RawInvoice[];
          
          const transformedInvoices: InvoiceProps[] = rawInvoices.map((invoice) => ({
            id: invoice.id,
            consignmentNo: invoice.consignment_no,
            from: invoice.origin_city || invoice.from_location,
            to: invoice.destination_city || invoice.to_location,
            date: new Date(invoice.created_at).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            }),
            // Cast to the union type since we know the values match our expected types
            status: invoice.status as Invoice['status'],
            amount: invoice.amount ? `₹${Number(invoice.amount).toLocaleString('en-IN')}` : 'Pending'
          }));
          
          setInvoices(transformedInvoices);
          setFilteredInvoices(transformedInvoices);
          
          // Calculate statistics
          const active = rawInvoices.filter((i) => 
            i.status === 'processing' || i.status === 'in-transit'
          ).length;
          
          const delivered = rawInvoices.filter((i) => i.status === 'delivered').length;
          const pending = rawInvoices.filter((i) => i.status === 'pending').length;
          const totalValue = rawInvoices.reduce((sum, i) => sum + Number(i.amount), 0);
          
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
