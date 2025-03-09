
import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface InvoiceProps {
  id: string;
  consignmentNo: string;
  from: string;
  to: string;
  date: string;
  status: 'pending' | 'processing' | 'in-transit' | 'delivered' | 'cancelled';
  amount: string;
}

interface InvoiceCardProps {
  invoice: InvoiceProps;
  index: number;
}

const statusConfig = {
  'pending': {
    label: 'Pending',
    bgColor: 'bg-status-pending/10',
    textColor: 'text-status-pending'
  },
  'processing': {
    label: 'Processing',
    bgColor: 'bg-status-processing/10',
    textColor: 'text-status-processing'
  },
  'in-transit': {
    label: 'In Transit',
    bgColor: 'bg-status-transit/10',
    textColor: 'text-status-transit'
  },
  'delivered': {
    label: 'Delivered',
    bgColor: 'bg-status-delivered/10',
    textColor: 'text-status-delivered'
  },
  'cancelled': {
    label: 'Cancelled',
    bgColor: 'bg-status-cancelled/10',
    textColor: 'text-status-cancelled'
  }
};

const InvoiceCard: React.FC<InvoiceCardProps> = ({ invoice, index }) => {
  const status = statusConfig[invoice.status];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="glass-card rounded-xl overflow-hidden hover:shadow-md transition-all duration-300"
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="bg-mateng-50 p-2 rounded-md mr-3">
              <FileText className="h-5 w-5 text-mateng-600" />
            </div>
            <div>
              <p className="font-medium">{invoice.consignmentNo}</p>
              <p className="text-xs text-muted-foreground">Invoice #{invoice.id}</p>
            </div>
          </div>
          <span className={`text-xs font-medium ${status.bgColor} ${status.textColor} px-2.5 py-1 rounded-full`}>
            {status.label}
          </span>
        </div>
        
        <div className="flex justify-between items-center mb-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">From</p>
            <p>{invoice.from}</p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground mx-2" />
          <div className="text-right">
            <p className="text-xs text-muted-foreground">To</p>
            <p>{invoice.to}</p>
          </div>
        </div>
        
        <div className="flex justify-between pt-3 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">Date</p>
            <p className="text-sm">{invoice.date}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Amount</p>
            <p className="font-medium">{invoice.amount}</p>
          </div>
        </div>
      </div>
      
      <Link to={`/invoices/${invoice.id}`} className="block w-full py-3 text-center text-sm font-medium bg-secondary/50 text-foreground hover:bg-mateng-50 transition-colors duration-200">
        View Details
      </Link>
    </motion.div>
  );
};

export default InvoiceCard;
