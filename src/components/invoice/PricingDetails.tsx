
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Charges {
  basicFreight: number;
  cod: number;
  freightHandling: number;
  pickupDelivery: number;
  packaging: number;
  cwbCharge: number;
  otherCharges: number;
}

interface PricingDetailsProps {
  charges: Charges;
  editable?: boolean;
  onChargeChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PricingDetails: React.FC<PricingDetailsProps> = ({ 
  charges, 
  editable = false,
  onChargeChange
}) => {
  const total = charges.basicFreight + charges.cod + charges.freightHandling + 
                charges.pickupDelivery + charges.packaging + charges.cwbCharge + 
                charges.otherCharges;

  if (editable && onChargeChange) {
    return (
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Pricing Details</h3>
        <div className="space-y-3">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="basicFreight">Basic Freight (₹)</Label>
            <Input
              id="basicFreight"
              name="basicFreight"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={charges.basicFreight || ''}
              onChange={onChargeChange}
            />
          </div>
          
          <div className="flex flex-col space-y-2">
            <Label htmlFor="cod">COD (₹)</Label>
            <Input
              id="cod"
              name="cod"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={charges.cod || ''}
              onChange={onChargeChange}
            />
          </div>
          
          <div className="flex flex-col space-y-2">
            <Label htmlFor="freightHandling">Freight Handling (₹)</Label>
            <Input
              id="freightHandling"
              name="freightHandling"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={charges.freightHandling || ''}
              onChange={onChargeChange}
            />
          </div>
          
          <div className="flex flex-col space-y-2">
            <Label htmlFor="pickupDelivery">Pickup & Delivery (₹)</Label>
            <Input
              id="pickupDelivery"
              name="pickupDelivery"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={charges.pickupDelivery || ''}
              onChange={onChargeChange}
            />
          </div>
          
          <div className="flex flex-col space-y-2">
            <Label htmlFor="packaging">Packaging (₹)</Label>
            <Input
              id="packaging"
              name="packaging"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={charges.packaging || ''}
              onChange={onChargeChange}
            />
          </div>
          
          <div className="flex flex-col space-y-2">
            <Label htmlFor="cwbCharge">CWB Charge (₹)</Label>
            <Input
              id="cwbCharge"
              name="cwbCharge"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={charges.cwbCharge || ''}
              onChange={onChargeChange}
            />
          </div>
          
          <div className="flex flex-col space-y-2">
            <Label htmlFor="otherCharges">Other Charges (₹)</Label>
            <Input
              id="otherCharges"
              name="otherCharges"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={charges.otherCharges || ''}
              onChange={onChargeChange}
            />
          </div>
          
          <div className="border-t pt-3 mt-3 flex justify-between font-bold">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
  }

  // Read-only view
  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">Pricing Details</h3>
      <div className="space-y-3">
        {charges.basicFreight > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Basic Freight</span>
            <span>₹{charges.basicFreight}</span>
          </div>
        )}
        {charges.cod > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">COD</span>
            <span>₹{charges.cod}</span>
          </div>
        )}
        {charges.freightHandling > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Freight Handling</span>
            <span>₹{charges.freightHandling}</span>
          </div>
        )}
        {charges.pickupDelivery > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Pickup & Delivery</span>
            <span>₹{charges.pickupDelivery}</span>
          </div>
        )}
        {charges.packaging > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Packaging</span>
            <span>₹{charges.packaging}</span>
          </div>
        )}
        {charges.cwbCharge > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">CWB Charge</span>
            <span>₹{charges.cwbCharge}</span>
          </div>
        )}
        {charges.otherCharges > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Other Charges</span>
            <span>₹{charges.otherCharges}</span>
          </div>
        )}
        <div className="border-t pt-3 mt-3 flex justify-between font-bold">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>
    </div>
  );
};

export default PricingDetails;
