
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
  mode: 'road', // Default to road transport
};

export const useInvoiceForm = (invoiceId?: string) => {
  const [invoiceData, setInvoiceData] = useState<InvoiceFormData>(defaultInvoiceData);
  const [isLoading, setIsLoading] = useState(!!invoiceId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [charges, setCharges] = useState({
    basicFreight: 0,
    cod: 0,
    freightHandling: 0,
    pickupDelivery: 0,
    packaging: 0,
    cwbCharge: 0,
    otherCharges: 0
  });

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
          
          // Try to parse charges from item_description if available
          if (invoice.item_description && invoice.item_description.includes('charges:')) {
            try {
              const chargesStr = invoice.item_description.split('charges:')[1].trim();
              const parsedCharges = JSON.parse(chargesStr);
              setCharges({
                basicFreight: parsedCharges.basicFreight || 0,
                cod: parsedCharges.cod || 0,
                freightHandling: parsedCharges.freightHandling || 0,
                pickupDelivery: parsedCharges.pickupDelivery || 0,
                packaging: parsedCharges.packaging || 0,
                cwbCharge: parsedCharges.cwbCharge || 0,
                otherCharges: parsedCharges.otherCharges || 0
              });
            } catch (e) {
              console.log('Error parsing charges from item_description:', e);
            }
          }
          
          // Extract the pure item description without charges
          let pureItemDescription = invoice.item_description || '';
          if (pureItemDescription.includes('charges:')) {
            pureItemDescription = pureItemDescription.split('charges:')[0].trim();
            if (pureItemDescription.startsWith('Items: ')) {
              pureItemDescription = pureItemDescription.substring(7);
            }
          }
          
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
            itemDescription: pureItemDescription,
            mode: invoice.mode || 'road',
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
  
  const handleChargeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCharges(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleStatusChange = (value: string) => {
    setInvoiceData(prev => ({ ...prev, status: value }));
  };
  
  const handleModeChange = (value: string) => {
    setInvoiceData(prev => ({ ...prev, mode: value }));
  };

  const calculateSubtotal = () => {
    return charges.basicFreight + charges.cod + charges.freightHandling + 
           charges.pickupDelivery + charges.packaging + charges.cwbCharge + 
           charges.otherCharges;
  };
  
  const calculateTotal = () => {
    return calculateSubtotal();
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
      
      // Calculate total from charges
      const totalAmount = calculateTotal();
      
      // Store charges data in item_description
      const itemDescription = `Items: ${invoiceData.itemDescription}; charges: ${JSON.stringify(charges)}`;
      
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
            amount: totalAmount,
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
            item_description: itemDescription,
            mode: invoiceData.mode || 'road',
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
            amount: totalAmount,
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
            item_description: itemDescription,
            mode: invoiceData.mode || 'road',
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
    charges,
    isLoading,
    isSubmitting,
    handleChange,
    handleChargeChange,
    handleStatusChange,
    handleModeChange,
    calculateSubtotal,
    calculateTotal,
    handleSubmit
  };
};
