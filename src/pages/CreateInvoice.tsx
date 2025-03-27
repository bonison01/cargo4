import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/ui/navbar/navbar';
import PageTransition from '@/components/ui/page-transition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Package, Truck, Plus, Minus } from 'lucide-react';

const CreateInvoice = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Core invoice data
  const [invoiceData, setInvoiceData] = useState({
    consignmentNo: '',
    from: '',
    to: '',
    weight: '',
  });
  
  // Sender and receiver data
  const [senderData, setSenderData] = useState({
    name: '',
    address: '',
    phone: ''
  });
  
  const [receiverData, setReceiverData] = useState({
    name: '',
    address: '',
    phone: ''
  });
  
  // Items
  const [items, setItems] = useState([
    {
      description: '',
      quantity: 1,
      weight: 0,
      dimensions: ''
    }
  ]);
  
  // Charges
  const [charges, setCharges] = useState({
    basicFreight: 0,
    cod: 0,
    freightHandling: 0,
    pickupDelivery: 0,
    packaging: 0,
    cwbCharge: 0,
    otherCharges: 0
  });
  
  const calculateSubtotal = () => {
    const { basicFreight, cod, freightHandling, pickupDelivery, packaging, cwbCharge, otherCharges } = charges;
    return basicFreight + cod + freightHandling + pickupDelivery + packaging + cwbCharge + otherCharges;
  };
  
  const calculateGST = () => {
    return calculateSubtotal(); // 18% GST
  };
  
  const calculateTotal = () => {
    return  calculateGST();
  };
  
  const handleInvoiceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInvoiceData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSenderChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSenderData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleReceiverChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReceiverData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItems(updatedItems);
  };
  
  const handleChargeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCharges(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };
  
  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, weight: 0, dimensions: '' }]);
  };
  
  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!invoiceData.from || !invoiceData.to || !senderData.name || !receiverData.name) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('You must be logged in to create an invoice');
      }
      
      // Generate a unique consignment number if not provided
      let consignmentNo = invoiceData.consignmentNo;
      if (!consignmentNo) {
        const date = new Date();
        const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        consignmentNo = `MT-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${randomNum}`;
      }
      
      // Prepare item description and other data
      const itemsDescription = items.map(item => 
        `${item.description} (${item.quantity}x, ${item.weight}kg, ${item.dimensions})`
      ).join('; ');
      
      const totalWeight = items.reduce((sum, item) => sum + (Number(item.weight) * Number(item.quantity)), 0);
      
      // Prepare sender and receiver info
      const senderInfo = `${senderData.name}\n${senderData.address}\n${senderData.phone}`;
      const receiverInfo = `${receiverData.name}\n${receiverData.address}\n${receiverData.phone}`;
      
      // Calculate total amount
      const totalAmount = calculateTotal();

      // Store charges data in item_description for later use
      const itemDescription = `Items: ${itemsDescription}; charges: ${JSON.stringify(charges)}`;
      
      // Save to Supabase
      const { data, error } = await supabase
        .from('invoices')
        .insert({
          consignment_no: consignmentNo,
          from_location: invoiceData.from,
          to_location: invoiceData.to,
          amount: totalAmount,
          items: itemsDescription,
          weight: totalWeight,
          status: 'pending',
          user_id: session.user.id,
          sender_info: senderInfo,
          receiver_info: receiverInfo,
          item_count: items.reduce((sum, item) => sum + Number(item.quantity), 0),
          item_description: itemDescription
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
      
      <main className="min-h-screen pt-20 pb-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-2">Create New Invoice</h1>
            <p className="text-muted-foreground mb-6">Fill in the details to create a new shipping invoice</p>
            
            <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow-sm">
              {/* Sender and Receiver Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 invoice-section">
                <div>
                  <h2 className="text-lg font-semibold mb-4">Sender Information</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="senderName">Name</Label>
                      <Input
                        id="senderName"
                        name="name"
                        placeholder="Full name"
                        value={senderData.name}
                        onChange={handleSenderChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="senderAddress">Address</Label>
                      <Textarea
                        id="senderAddress"
                        name="address"
                        placeholder="Complete address"
                        value={senderData.address}
                        onChange={handleSenderChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="senderPhone">Phone Number</Label>
                      <Input
                        id="senderPhone"
                        name="phone"
                        placeholder="Contact number"
                        value={senderData.phone}
                        onChange={handleSenderChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-lg font-semibold mb-4">Receiver Information</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="receiverName">Name</Label>
                      <Input
                        id="receiverName"
                        name="name"
                        placeholder="Full name"
                        value={receiverData.name}
                        onChange={handleReceiverChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="receiverAddress">Address</Label>
                      <Textarea
                        id="receiverAddress"
                        name="address"
                        placeholder="Complete address"
                        value={receiverData.address}
                        onChange={handleReceiverChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="receiverPhone">Phone Number</Label>
                      <Input
                        id="receiverPhone"
                        name="phone"
                        placeholder="Contact number"
                        value={receiverData.phone}
                        onChange={handleReceiverChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Shipment Information */}
              <div className="mb-8 invoice-section">
                <h2 className="text-lg font-semibold mb-4">Shipment Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="from">From (Origin)</Label>
                    <Input
                      id="from"
                      name="from"
                      placeholder="e.g., Imphal"
                      value={invoiceData.from}
                      onChange={handleInvoiceChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="to">To (Destination)</Label>
                    <Input
                      id="to"
                      name="to"
                      placeholder="e.g., Delhi"
                      value={invoiceData.to}
                      onChange={handleInvoiceChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="consignmentNo">Consignment No. (Optional)</Label>
                    <Input
                      id="consignmentNo"
                      name="consignmentNo"
                      placeholder="Auto-generated if left blank"
                      value={invoiceData.consignmentNo}
                      onChange={handleInvoiceChange}
                    />
                  </div>
                </div>
              </div>
              
              {/* Items */}
              <div className="mb-8 invoice-section">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Items</h2>
                  <Button 
                    type="button" 
                    onClick={addItem}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" /> Add Item
                  </Button>
                </div>
                
                {items.map((item, index) => (
                  <div key={index} className="mb-4 p-4 border rounded-lg relative">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-[#025200]" />
                        <span className="font-medium">Item {index + 1}</span>
                      </div>
                      
                      {items.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label htmlFor={`item-description-${index}`}>Description</Label>
                        <Input
                          id={`item-description-${index}`}
                          placeholder="Item description"
                          value={item.description}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`item-quantity-${index}`}>Quantity</Label>
                        <Input
                          id={`item-quantity-${index}`}
                          type="number"
                          min="1"
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`item-weight-${index}`}>Weight (kg)</Label>
                        <Input
                          id={`item-weight-${index}`}
                          type="number"
                          step="0.1"
                          min="0"
                          placeholder="Weight"
                          value={item.weight}
                          onChange={(e) => handleItemChange(index, 'weight', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`item-dimensions-${index}`}>Dimensions (L×W×H)</Label>
                        <Input
                          id={`item-dimensions-${index}`}
                          placeholder="e.g., 10×5×3 cm"
                          value={item.dimensions}
                          onChange={(e) => handleItemChange(index, 'dimensions', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Charges */}
              <div className="mb-8 invoice-section">
                <h2 className="text-lg font-semibold mb-4">Charges</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="basicFreight">Basic Freight</Label>
                    <Input
                      id="basicFreight"
                      name="basicFreight"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={charges.basicFreight || ''}
                      onChange={handleChargeChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cod">COD</Label>
                    <Input
                      id="cod"
                      name="cod"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={charges.cod || ''}
                      onChange={handleChargeChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="freightHandling">Freight Handling</Label>
                    <Input
                      id="freightHandling"
                      name="freightHandling"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={charges.freightHandling || ''}
                      onChange={handleChargeChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="pickupDelivery">Pickup & Delivery</Label>
                    <Input
                      id="pickupDelivery"
                      name="pickupDelivery"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={charges.pickupDelivery || ''}
                      onChange={handleChargeChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="packaging">Packaging</Label>
                    <Input
                      id="packaging"
                      name="packaging"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={charges.packaging || ''}
                      onChange={handleChargeChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cwbCharge">CWB Charge</Label>
                    <Input
                      id="cwbCharge"
                      name="cwbCharge"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={charges.cwbCharge || ''}
                      onChange={handleChargeChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="otherCharges">Other Charges</Label>
                    <Input
                      id="otherCharges"
                      name="otherCharges"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={charges.otherCharges || ''}
                      onChange={handleChargeChange}
                    />
                  </div>
                </div>
                
                <div className="mt-6 border-t pt-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span>₹{calculateSubtotal().toFixed(2)}</span>
                  </div>
                  {/* <div className="flex justify-between items-center mb-1">
                    <span className="text-muted-foreground">CGST (18%):</span>
                    <span>₹{calculateGST().toFixed(2)}</span>
                  </div> */}
                  <div className="flex justify-between items-center font-bold">
                    <span>Total:</span>
                    <span>₹{calculateTotal().toFixed(2)}</span>
                  </div>
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
                  className="bg-[#025200] hover:bg-[#013700]"
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
                  ) : (
                    <span className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Create Invoice
                    </span>
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

export default CreateInvoice;
