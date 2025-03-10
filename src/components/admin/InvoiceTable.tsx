
import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Invoice } from '@/types/invoice';

interface InvoiceTableProps {
  invoices: Invoice[];
  isLoading: boolean;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ invoices, isLoading }) => {
  if (invoices.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">
          No invoices found.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Consignment No</TableHead>
          <TableHead>From</TableHead>
          <TableHead>To</TableHead>
          <TableHead>Product Value</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">{invoice.consignment_no}</TableCell>
            <TableCell>{invoice.from_location}</TableCell>
            <TableCell>{invoice.to_location}</TableCell>
            <TableCell>₹{invoice.amount}</TableCell>
            <TableCell>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                invoice.status === 'delivered' 
                  ? 'bg-status-delivered/10 text-status-delivered' 
                  : invoice.status === 'in-transit'
                    ? 'bg-status-transit/10 text-status-transit'
                    : invoice.status === 'processing'
                      ? 'bg-status-processing/10 text-status-processing'
                      : invoice.status === 'cancelled'
                        ? 'bg-status-cancelled/10 text-status-cancelled'
                        : 'bg-status-pending/10 text-status-pending'
              }`}>
                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
              </span>
            </TableCell>
            <TableCell>{new Date(invoice.created_at).toLocaleDateString()}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Link to={`/invoices/${invoice.id}`}>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to={`/admin/invoices/edit/${invoice.id}`}>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default InvoiceTable;
