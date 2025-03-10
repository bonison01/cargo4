
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Invoice, InvoiceFormData } from '@/types/invoice';

const defaultInvoiceData: InvoiceFormData = {
  consignmentNo: '',
  from: '',
  to: '',
  amount: '',
  items: '',
  weight: '',
  status: 'pending',
  handlingFee: '200',
  pickupFee: '100',
  deliveryFee: '150',
  dimensions: '',
  pickupDate: new Date().toISOString().split('T')[0], // Today's date as default
  originCity: '',
  destinationCity: '',
  senderInfo: '',
  receiverInfo: '',
  itemCount: '1',
  itemPhoto: '',
  itemDescription: '',
};

export const useInvoiceForm = (invoiceId?: string) => {
  const [invoiceData, setInvoiceData] = useState<InvoiceFormData>(defaultInvoiceData);
  const [isLoading, setIsLoading] = useState(!!invoiceId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch invoice data if editing
  useEffect(() => {
    const fetchInvoiceData = async () => {
      if (!invoiceId) return;
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('invoices')
          .select('*')
          .eq('id', invoiceId)
          .single();
        
        if (error) throw error;
        
        if (data) {
          const invoice = data as Invoice;
          setInvoiceData({
            consignmentNo: invoice.consignment_no || '',
            from: invoice.from_location || '',
            to: invoice.to_location || '',
            amount: invoice.amount?.toString() || '',
            items: invoice.items || '',
            weight: invoice.weight?.toString() || '',
            status: invoice.status || 'pending',
            handlingFee: '200', // Default values as they're not in the database yet
            pickupFee: '100',
            deliveryFee: '150',
            dimensions: '',
            pickupDate: invoice.pickup_date || new Date().toISOString().split('T')[0],
            originCity: invoice.origin_city || '',
            destinationCity: invoice.destination_city || '',
            senderInfo: invoice.sender_info || '',
            receiverInfo: invoice.receiver_info || '',
            itemCount: invoice.item_count?.toString() || '1',
            itemPhoto: invoice.item_photo || '',
            itemDescription: invoice.item_description || '',
          });
        }
      } catch (error: any) {
        console.error('Error fetching invoice:', error);
        toast({
          title: "Failed to load invoice",
          description: error.message || "An error occurred. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInvoiceData();
  }, [invoiceId, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInvoiceData(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: string) => {
    setInvoiceData(prev => ({ ...prev, status: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!invoiceData.from || !invoiceData.to || !invoiceData.originCity || !invoiceData.destinationCity) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication error",
          description: "You must be logged in to perform this action",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }
      
      const userId = session.user.id;
      
      // Generate a unique consignment number if not provided
      let consignmentNo = invoiceData.consignmentNo;
      if (!consignmentNo) {
        const date = new Date();
        const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        consignmentNo = `MT-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${randomNum}`;
      }
      
      // Update or create invoice
      let result;
      if (invoiceId) {
        // Update existing invoice
        result = await supabase
          .from('invoices')
          .update({
            consignment_no: consignmentNo,
            from_location: invoiceData.from,
            to_location: invoiceData.to,
            amount: parseFloat(invoiceData.amount) || 0,
            items: invoiceData.items,
            weight: parseFloat(invoiceData.weight) || null,
            status: invoiceData.status,
            pickup_date: invoiceData.pickupDate,
            origin_city: invoiceData.originCity,
            destination_city: invoiceData.destinationCity,
            sender_info: invoiceData.senderInfo,
            receiver_info: invoiceData.receiverInfo,
            item_count: parseInt(invoiceData.itemCount) || 1,
            item_photo: invoiceData.itemPhoto,
            item_description: invoiceData.itemDescription,
            // Don't update user_id when editing
          })
          .eq('id', invoiceId)
          .select();
      } else {
        // Create new invoice
        result = await supabase
          .from('invoices')
          .insert({
            consignment_no: consignmentNo,
            from_location: invoiceData.from,
            to_location: invoiceData.to,
            amount: 0, // For new invoices, amount is set to 0 and will be updated by admin
            items: invoiceData.items,
            weight: parseFloat(invoiceData.weight) || null,
            status: 'pending', // Always set to pending for new invoices
            user_id: userId,
            pickup_date: invoiceData.pickupDate,
            origin_city: invoiceData.originCity,
            destination_city: invoiceData.destinationCity,
            sender_info: invoiceData.senderInfo,
            receiver_info: invoiceData.receiverInfo,
            item_count: parseInt(invoiceData.itemCount) || 1,
            item_photo: invoiceData.itemPhoto,
            item_description: invoiceData.itemDescription,
          })
          .select();
      }
      
      if (result.error) {
        console.error('Supabase error:', result.error);
        throw result.error;
      }
      
      toast({
        title: invoiceId ? "Invoice updated successfully" : "Invoice created successfully",
        description: `Consignment number: ${consignmentNo}`,
        variant: "default",
      });
      
      navigate('/admin/dashboard');
    } catch (error: any) {
      console.error(error);
      toast({
        title: invoiceId ? "Failed to update invoice" : "Failed to create invoice",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    invoiceData,
    isLoading,
    isSubmitting,
    handleChange,
    handleStatusChange,
    handleSubmit
  };
};
