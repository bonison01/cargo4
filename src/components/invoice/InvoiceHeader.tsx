
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Edit, Printer } from 'lucide-react';

interface InvoiceHeaderProps {
  consignmentNo: string;
  status: string;
  isAdmin: boolean;
  invoiceId: string;
  onPrintLabel: () => void;
}

const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({
  consignmentNo,
  status,
  isAdmin,
  invoiceId,
  onPrintLabel
}) => {
  const getStatusClass = (status: string) => {
    switch(status) {
      case 'delivered':
        return 'bg-status-delivered/10 text-status-delivered';
      case 'in-transit':
        return 'bg-status-transit/10 text-status-transit';
      case 'processing':
        return 'bg-status-processing/10 text-status-processing';
      case 'cancelled':
        return 'bg-status-cancelled/10 text-status-cancelled';
      default:
        return 'bg-status-pending/10 text-status-pending';
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-3xl font-bold">Invoice Details</h1>
          <span className={`text-sm font-bold px-3 py-1.5 rounded-full ${getStatusClass(status)}`}>
            <strong>{status.charAt(0).toUpperCase() + status.slice(1)}</strong>
          </span>
        </div>
        <p className="text-muted-foreground">Consignment #{consignmentNo}</p>
      </div>
      <div className="flex gap-3">
        {isAdmin && (
          <Link to={`/admin/invoices/edit/${invoiceId}`}>
            <Button variant="outline" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Invoice
            </Button>
          </Link>
        )}
        <Button variant="outline" className="flex items-center gap-2" onClick={onPrintLabel}>
          <Printer className="h-4 w-4" />
          Print Shipping Label
        </Button>
      </div>
    </div>
  );
};

export default InvoiceHeader;
