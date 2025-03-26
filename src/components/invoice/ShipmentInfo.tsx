
import React from 'react';
import { MapPin, Package, Clock, FileText } from 'lucide-react';
import { Invoice } from '@/types/invoice';

interface ShipmentInfoProps {
  invoice: Invoice;
}

const ShipmentInfo: React.FC<ShipmentInfoProps> = ({ invoice }) => {
  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Package className="h-5 w-5 text-mateng-600" />
        <h2 className="text-xl font-semibold">Shipment Information</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
        <div>
          <p className="text-sm text-muted-foreground mb-1">From</p>
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-mateng-600 mr-2" />
            <p className="font-medium">{invoice.from_location}</p>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">To</p>
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-mateng-600 mr-2" />
            <p className="font-medium">{invoice.to_location}</p>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Created On</p>
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-mateng-600 mr-2" />
            <p className="font-medium">{new Date(invoice.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Product Value</p>
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-mateng-600 mr-2" />
            <p className="font-medium">₹{invoice.amount}</p>
          </div>
        </div>
        {invoice.weight && (
          <div>
            <p className="text-sm text-muted-foreground mb-1">Weight</p>
            <p className="font-medium">{invoice.weight} kg</p>
          </div>
        )}
        {invoice.items && (
          <div>
            <p className="text-sm text-muted-foreground mb-1">Items</p>
            <p className="font-medium">{invoice.items}</p>
          </div>
        )}
        {invoice.sender_info && (
          <div>
            <p className="text-sm text-muted-foreground mb-1">Sender</p>
            <p className="font-medium">{invoice.sender_info}</p>
          </div>
        )}
        {invoice.receiver_info && (
          <div>
            <p className="text-sm text-muted-foreground mb-1">Receiver</p>
            <p className="font-medium">{invoice.receiver_info}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShipmentInfo;
