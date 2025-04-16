import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from 'react-router-dom';
import { InvoiceFormData } from '@/types/invoice';
import { Textarea } from "@/components/ui/textarea";
import PricingDetails from '@/components/invoice/PricingDetails';

interface InvoiceFormProps {
  invoiceData: InvoiceFormData;
  charges?: {
    basicFreight: number;
    cod: number;
    freightHandling: number;
    pickupDelivery: number;
    packaging: number;
    cwbCharge: number;
    otherCharges: number;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleChargeChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleStatusChange: (value: string) => void;
  handleModeChange?: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  calculateSubtotal?: () => number;
  calculateTotal?: () => number;
  isSubmitting: boolean;
  isEditing: boolean;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ 
  invoiceData, 
  charges = {
    basicFreight: 0,
    cod: 0,
    freightHandling: 0,
    pickupDelivery: 0,
    packaging: 0,
    cwbCharge: 0,
    otherCharges: 0
  },
  handleChange, 
  handleChargeChange = () => {},
  handleStatusChange,
  handleModeChange = () => {},
  handleSubmit,
  calculateSubtotal = () => 0,
  calculateTotal = () => 0,
  isSubmitting,
  isEditing
}) => {
  const navigate = useNavigate();

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6">
      <h3 className="text-lg font-medium mb-4">Basic Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* <div className="space-y-2">
          <Label htmlFor="originCity">City of Origin</Label>
          <Input
            id="originCity"
            name="originCity"
            placeholder="e.g., Mumbai"
            value={invoiceData.originCity}
            onChange={handleChange}
            required
          />
        </div> */}
        
        {/* <div className="space-y-2">
          <Label htmlFor="destinationCity">City of Destination</Label>
          <Input
            id="destinationCity"
            name="destinationCity"
            placeholder="e.g., Delhi"
            value={invoiceData.destinationCity}
            onChange={handleChange}
            required
          />
        </div> */}
        
        <div className="space-y-2">
          <Label htmlFor="from">From (Origin Address)</Label>
          <Input
            id="from"
            name="from"
            placeholder="Complete address"
            value={invoiceData.from}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="to">To (Destination Address)</Label>
          <Input
            id="to"
            name="to"
            placeholder="Complete address"
            value={invoiceData.to}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pickupDate">Pickup Date</Label>
          <Input
            id="pickupDate"
            name="pickupDate"
            type="date"
            value={invoiceData.pickupDate}
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
          <Label htmlFor="itemCount">Number of Items</Label>
          <Input
            id="itemCount"
            name="itemCount"
            type="number"
            placeholder="e.g., 3"
            value={invoiceData.itemCount}
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
          <Label htmlFor="mode">Shipping Mode</Label>
          <Select value={invoiceData.mode || 'air'} onValueChange={handleModeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="road">Road</SelectItem>
              <SelectItem value="air">Air</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <h3 className="text-lg font-medium mb-4">Contact Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-2 md:col-span-1">
          <Label htmlFor="senderInfo">Sender Information</Label>
          <Textarea
            id="senderInfo"
            name="senderInfo"
            placeholder="Name, Phone, Email"
            className="min-h-[100px]"
            value={invoiceData.senderInfo}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2 md:col-span-1">
          <Label htmlFor="receiverInfo">Receiver Information</Label>
          <Textarea
            id="receiverInfo"
            name="receiverInfo"
            placeholder="Name, Phone, Email"
            className="min-h-[100px]"
            value={invoiceData.receiverInfo}
            onChange={handleChange}
          />
        </div>
      </div>

      <h3 className="text-lg font-medium mb-4">Item Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="itemDescription">Detailed Item Description (Optional)</Label>
          <Textarea
            id="itemDescription"
            name="itemDescription"
            placeholder="Additional details about the items..."
            className="min-h-[100px]"
            value={invoiceData.itemDescription}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="itemPhoto">Item Photo URL (Optional)</Label>
          <Input
            id="itemPhoto"
            name="itemPhoto"
            placeholder="Enter image URL"
            value={invoiceData.itemPhoto}
            onChange={handleChange}
          />
        </div>
      </div>

      {isEditing && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Charges & Status</h3>
          
          <div className="mb-6">
            <PricingDetails 
              charges={charges} 
              editable={true} 
              onChargeChange={handleChargeChange} 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            
            <div className="space-y-2">
              <Label htmlFor="mode">Shipping Mode</Label>
              <Select value={invoiceData.mode || 'road'} onValueChange={handleModeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="road">Road</SelectItem>
                  <SelectItem value="air">Air</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
      
      {!isEditing && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-100 rounded-md">
          <p className="text-sm text-yellow-800">
            Note: Our team will calculate the shipping charges after reviewing your shipment details and will update you soon.
          </p>
        </div>
      )}
      
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
      
      <div className="flex justify-end gap-3 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/admin/dashboard')}
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
