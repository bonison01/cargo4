
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Invoice } from '@/types/invoice';
import { generateInvoicePDF } from '@/utils/pdf-utils';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface InvoiceTableProps {
  invoices: Invoice[];
  isLoading: boolean;
  onInvoiceDeleted?: () => void;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ invoices, isLoading, onInvoiceDeleted }) => {
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);
  
  if (invoices.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">
          No invoices found.
        </p>
      </div>
    );
  }

  const handleDownload = (invoice: Invoice) => {
    const doc = generateInvoicePDF(invoice);
    doc.save(`mateng-invoice-${invoice.consignment_no}.pdf`);
    
    toast({
      title: "Invoice Downloaded",
      description: `Invoice #${invoice.consignment_no} has been downloaded.`,
    });
  };

  const confirmDelete = (invoice: Invoice) => {
    setInvoiceToDelete(invoice);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!invoiceToDelete) return;
    
    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', invoiceToDelete.id);
      
      if (error) throw error;
      
      toast({
        title: "Invoice Deleted",
        description: `Invoice #${invoiceToDelete.consignment_no} has been deleted.`,
      });
      
      if (onInvoiceDeleted) {
        onInvoiceDeleted();
      }
    } catch (error: any) {
      console.error('Error deleting invoice:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete invoice",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setInvoiceToDelete(null);
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Consignment No</TableHead>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Sender Info</TableHead>
            <TableHead>Receiver Info</TableHead>
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
              <TableCell className="max-w-[150px] truncate" title={invoice.sender_info || ""}>
                {invoice.sender_info || "N/A"}
              </TableCell>
              <TableCell className="max-w-[150px] truncate" title={invoice.receiver_info || ""}>
                {invoice.receiver_info || "N/A"}
              </TableCell>
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
                  <Button variant="ghost" size="sm" onClick={() => handleDownload(invoice)}>
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => confirmDelete(invoice)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Invoice</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete invoice #{invoiceToDelete?.consignment_no}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default InvoiceTable;
