
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type InvoiceFormProps = {
  invoiceData: {
    consignmentNo: string;
    from: string;
    to: string;
    amount: string;
    items: string;
    weight: string;
    status: string;
    handlingFee: string;
    pickupFee: string;
    deliveryFee: string;
    dimensions: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleStatusChange: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  isEditing: boolean;
};

const InvoiceForm = ({ 
  invoiceData, 
  handleChange, 
  handleStatusChange, 
  handleSubmit, 
  isSubmitting,
  isEditing
}: InvoiceFormProps) => {
  const navigate = useNavigate();

  return (
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
              {isEditing ? 'Updating Invoice...' : 'Creating Invoice...'}
            </span>
          ) : (
            isEditing ? 'Update Invoice' : 'Create Invoice'
          )}
        </Button>
      </div>
    </form>
  );
};

export default InvoiceForm;
