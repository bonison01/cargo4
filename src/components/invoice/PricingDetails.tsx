
import React from 'react';

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
}

const PricingDetails: React.FC<PricingDetailsProps> = ({ charges }) => {
  const total = charges.basicFreight + charges.cod + charges.freightHandling + 
                charges.pickupDelivery + charges.packaging + charges.cwbCharge + 
                charges.otherCharges;

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
