import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/ui/navbar/navbar';
import PageTransition from '@/components/ui/page-transition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";

const CreateInvoice = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    consignmentNo: '',
    from: '',
    to: '',
    amount: '',
    items: '',
    weight: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInvoiceData(prev => ({ ...prev, [name]: value }));
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
      
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('You must be logged in to create an invoice');
      }
      
      // Save to Supabase
      const { data, error } = await supabase
        .from('invoices')
        .insert({
          consignment_no: consignmentNo,
          from_location: invoiceData.from,
          to_location: invoiceData.to,
          amount: parseFloat(invoiceData.amount) || 0,
          items: invoiceData.items,
          weight: parseFloat(invoiceData.weight) || null,
          status: 'pending',
          user_id: session.user.id
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Invoice created successfully",
        description: `Consignment number: ${consignmentNo}`,
        variant: "default",
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Failed to create invoice",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <Helmet>
        <title>Create New Invoice - Mateng Shipping</title>
        <meta name="description" content="Create a new shipping invoice with Mateng Shipping." />
      </Helmet>

      <Navbar />
      
      <main className="min-h-screen pt-28 pb-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Create New Invoice</h1>
            <p className="text-muted-foreground mb-8">Fill in the details to create a new shipping invoice</p>
            
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
                  onClick={() => navigate('/dashboard')}
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
                      Creating Invoice...
                    </span>
                  ) : "Create Invoice"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </PageTransition>
  );
};

export default CreateInvoice;
