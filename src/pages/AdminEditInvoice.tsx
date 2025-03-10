
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/ui/navbar/navbar';
import PageTransition from '@/components/ui/page-transition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminEditInvoice = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
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
  });

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setIsAdmin(false);
        return;
      }
      
      const userEmail = session.user.email || '';
      setIsAdmin(userEmail.endsWith('@mateng.com') || userEmail.includes('admin'));
      
      if (!userEmail.endsWith('@mateng.com') && !userEmail.includes('admin')) {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges",
          variant: "destructive",
        });
        navigate('/dashboard');
      }
    };
    
    checkAdminStatus();
  }, [toast, navigate]);

  // Fetch invoice data if editing
  useEffect(() => {
    const fetchInvoiceData = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('invoices')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setInvoiceData({
            consignmentNo: data.consignment_no || '',
            from: data.from_location || '',
            to: data.to_location || '',
            amount: data.amount?.toString() || '',
            items: data.items || '',
            weight: data.weight?.toString() || '',
            status: data.status || 'pending',
            handlingFee: '200', // Default values as they're not in the database yet
            pickupFee: '100',
            deliveryFee: '150',
            dimensions: '',
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
    
    if (isAdmin) {
      fetchInvoiceData();
    }
  }, [id, isAdmin, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInvoiceData(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: string) => {
    setInvoiceData(prev => ({ ...prev, status: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!invoiceData.from || !invoiceData.to || !invoiceData.amount) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Generate a unique consignment number if not provided
      let consignmentNo = invoiceData.consignmentNo;
      if (!consignmentNo) {
        const date = new Date();
        const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        consignmentNo = `MT-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${randomNum}`;
      }
      
      // Get current user for new invoices
      let userId = null;
      if (!id) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          throw new Error('You must be logged in to create an invoice');
        }
        userId = session.user.id;
      }
      
      // Update or create invoice
      let result;
      if (id) {
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
            status: invoiceData.status
          })
          .eq('id', id)
          .select();
      } else {
        // Create new invoice
        result = await supabase
          .from('invoices')
          .insert({
            consignment_no: consignmentNo,
            from_location: invoiceData.from,
            to_location: invoiceData.to,
            amount: parseFloat(invoiceData.amount) || 0,
            items: invoiceData.items,
            weight: parseFloat(invoiceData.weight) || null,
            status: invoiceData.status,
            user_id: userId
          })
          .select();
      }
      
      if (result.error) throw result.error;
      
      toast({
        title: id ? "Invoice updated successfully" : "Invoice created successfully",
        description: `Consignment number: ${consignmentNo}`,
        variant: "default",
      });
      
      navigate('/admin/dashboard');
    } catch (error: any) {
      console.error(error);
      toast({
        title: id ? "Failed to update invoice" : "Failed to create invoice",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAdmin) {
    return (
      <PageTransition>
        <Helmet>
          <title>Admin Access Denied - Mateng Shipping</title>
        </Helmet>
        <Navbar />
        <main className="min-h-screen pt-28 pb-16">
          <div className="container px-4 mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
            <p className="mb-8">You don't have permission to access this page.</p>
            <Button className="bg-mateng-600 hover:bg-mateng-700" onClick={() => navigate('/dashboard')}>
              Return to Dashboard
            </Button>
          </div>
        </main>
      </PageTransition>
    );
  }

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
            
            <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="from">From (Origin)</Label>
                  <Input
                    id="from"
                    name="from"
                    placeholder="e.g., Imphal"
                    value={invoiceData.from}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="to">To (Destination)</Label>
                  <Input
                    id="to"
                    name="to"
                    placeholder="e.g., Delhi"
                    value={invoiceData.to}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="amount">Value of the Product (₹)</Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="text"
                    placeholder="e.g., 2500"
                    value={invoiceData.amount}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="text"
                    placeholder="e.g., 5"
                    value={invoiceData.weight}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dimensions">Dimensions (LxWxH cm)</Label>
                  <Input
                    id="dimensions"
                    name="dimensions"
                    placeholder="e.g., 30x20x15"
                    value={invoiceData.dimensions}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={invoiceData.status} onValueChange={handleStatusChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="in-transit">In Transit</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="items">Items Description</Label>
                  <Input
                    id="items"
                    name="items"
                    placeholder="e.g., Electronics, Clothing, etc."
                    value={invoiceData.items}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="handlingFee">Handling Fee (₹)</Label>
                  <Input
                    id="handlingFee"
                    name="handlingFee"
                    placeholder="e.g., 200"
                    value={invoiceData.handlingFee}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pickupFee">Pickup Fee (₹)</Label>
                  <Input
                    id="pickupFee"
                    name="pickupFee"
                    placeholder="e.g., 100"
                    value={invoiceData.pickupFee}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deliveryFee">Delivery Fee (₹)</Label>
                  <Input
                    id="deliveryFee"
                    name="deliveryFee"
                    placeholder="e.g., 150"
                    value={invoiceData.deliveryFee}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="consignmentNo">Consignment No. (Optional)</Label>
                  <Input
                    id="consignmentNo"
                    name="consignmentNo"
                    placeholder="Auto-generated if left blank"
                    value={invoiceData.consignmentNo}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/dashboard')}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-mateng-600 hover:bg-mateng-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {id ? 'Updating Invoice...' : 'Creating Invoice...'}
                    </span>
                  ) : (
                    id ? 'Update Invoice' : 'Create Invoice'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </PageTransition>
  );
};

export default AdminEditInvoice;
